// =============================================
// Sessions and credential checking.
//
// No dependencies — Node's own crypto does the signing, so adding this does
// not change how the site builds or deploys.
//
// A session is a cookie holding base64url(payload).hmac. The payload is not
// secret (it names the holder and when it expires) but it cannot be edited,
// because any change breaks the signature. Nothing is stored server side, so
// there is no session table to keep.
// =============================================
const crypto = require('crypto');

// Instructors get no session at all — a code is typed every time a test is
// opened, so there is nothing to keep or steal. Only the owner dashboard holds
// a session, and only briefly, so that paging around it does not re-prompt on
// every click. It is a browser-session cookie, so closing the browser ends it.
const OWNER_SESSION_MINUTES = 60;
const COOKIE_NAME = 'rds_session';

function secret() {
    const s = process.env.SESSION_SECRET;
    if (!s || s.length < 16) {
        throw new Error('SESSION_SECRET is missing or too short (need 16+ characters)');
    }
    return s;
}

function b64url(buf) {
    return Buffer.from(buf).toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64url(str) {
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
}

function sign(payloadStr) {
    return b64url(crypto.createHmac('sha256', secret()).update(payloadStr).digest());
}

// Constant-time compare so a wrong signature can't be narrowed down by timing.
function safeEqual(a, b) {
    const ba = Buffer.from(String(a));
    const bb = Buffer.from(String(b));
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
}

function createSession(name, role) {
    const payload = JSON.stringify({
        n: name,
        r: role,                                        // 'owner' only
        exp: Date.now() + OWNER_SESSION_MINUTES * 60 * 1000
    });
    const body = b64url(payload);
    return `${body}.${sign(payload)}`;
}

function readSession(token) {
    if (!token || typeof token !== 'string' || !token.includes('.')) return null;
    const idx = token.lastIndexOf('.');
    const body = token.slice(0, idx);
    const sig = token.slice(idx + 1);
    let payloadStr;
    try {
        payloadStr = unb64url(body);
    } catch (e) {
        return null;
    }
    if (!safeEqual(sig, sign(payloadStr))) return null;
    let payload;
    try {
        payload = JSON.parse(payloadStr);
    } catch (e) {
        return null;
    }
    if (!payload.exp || Date.now() > payload.exp) return null;   // expired
    return payload;
}

// No Max-Age, deliberately: this is a browser-session cookie, so it is gone
// when the browser closes. The signed payload also carries its own expiry, so
// it cannot outlive OWNER_SESSION_MINUTES even if the cookie is kept.
// httpOnly keeps it away from page scripts; SameSite=Lax survives a normal
// navigation to /admin while still blocking cross-site posts.
function cookieHeader(token) {
    return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/`;
}

function clearCookieHeader() {
    return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

function sessionFrom(req) {
    const raw = req.headers.cookie || '';
    const hit = raw.split(';').map(s => s.trim())
        .find(s => s.startsWith(COOKIE_NAME + '='));
    if (!hit) return null;
    return readSession(hit.slice(COOKIE_NAME.length + 1));
}

// Parses INSTRUCTOR_CODES ("Name:CODE,Name:CODE") into pairs. Strips wrapping
// quotes, which is easy to paste in by accident when copying from a .env file
// and would otherwise corrupt the first and last entry silently.
function parseCodes() {
    let raw = (process.env.INSTRUCTOR_CODES || '').trim();
    if (raw.length > 1 && /^["'].*["']$/.test(raw)) raw = raw.slice(1, -1);
    return raw.split(',').map(pair => {
        const i = pair.indexOf(':');
        if (i < 1) return null;
        const name = pair.slice(0, i).trim().replace(/^["']|["']$/g, '');
        const code = pair.slice(i + 1).trim().replace(/^["']|["']$/g, '').toUpperCase();
        return (name && code) ? { name, code } : null;
    }).filter(Boolean);
}

// INSTRUCTOR_CODES is "Name:CODE,Name:CODE". Codes are compared in constant
// time and case-insensitively, so a code written down in lower case still works.
// Throws if no codes are configured at all, so a setup problem surfaces as a
// server error rather than masquerading as a wrong code.
function findInstructor(code) {
    const pairs = parseCodes();
    if (!pairs.length) {
        throw new Error('INSTRUCTOR_CODES is missing or unparseable');
    }
    if (!code || typeof code !== 'string') return null;
    const supplied = code.trim().toUpperCase();
    if (!supplied) return null;
    let match = null;
    // Walk every entry rather than returning early, so the time taken does not
    // reveal how far down the list a code sits.
    pairs.forEach(p => {
        if (safeEqual(supplied, p.code)) match = p.name;
    });
    return match;
}

// Booleans only, for the setup check. Never returns a code or a secret.
function configReport() {
    let codes = [];
    try { codes = parseCodes(); } catch (e) { codes = []; }
    const secret = process.env.SESSION_SECRET || '';
    return {
        sessionSecret: secret.length >= 16,
        sessionSecretTooShort: !!secret && secret.length < 16,
        instructorCodes: codes.length > 0,
        instructorCount: codes.length,
        instructorNames: codes.map(c => c.name),          // names only, never codes
        codeLengths: codes.map(c => c.code.length),       // to spot a mangled paste
        ownerPassword: !!process.env.OWNER_PASSWORD
    };
}

function checkOwner(password) {
    const expected = process.env.OWNER_PASSWORD || '';
    if (!expected || !password) return false;
    return safeEqual(String(password), expected);
}

// Approximate location, from headers Vercel adds to every request. No
// third-party geolocation service involved.
function requestOrigin(req) {
    const h = req.headers;
    const dec = v => {
        try { return v ? decodeURIComponent(v) : ''; } catch (e) { return v || ''; }
    };
    const ip = (h['x-forwarded-for'] || '').split(',')[0].trim()
        || req.socket?.remoteAddress || '';
    return {
        ip,
        city: dec(h['x-vercel-ip-city']),
        region: dec(h['x-vercel-ip-country-region']),
        country: dec(h['x-vercel-ip-country']),
        ua: (h['user-agent'] || '').slice(0, 200)
    };
}

module.exports = {
    OWNER_SESSION_MINUTES,
    configReport,
    COOKIE_NAME,
    createSession,
    readSession,
    cookieHeader,
    clearCookieHeader,
    sessionFrom,
    findInstructor,
    checkOwner,
    requestOrigin
};
