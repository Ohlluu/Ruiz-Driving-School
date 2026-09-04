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

const SESSION_HOURS = 8;
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
        r: role,                                        // 'instructor' | 'owner'
        exp: Date.now() + SESSION_HOURS * 3600 * 1000
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

function cookieHeader(token) {
    const maxAge = SESSION_HOURS * 3600;
    // httpOnly keeps it away from page scripts; SameSite=Lax survives a normal
    // navigation to /admin while still blocking cross-site posts.
    return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
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

// INSTRUCTOR_CODES is "Name:CODE,Name:CODE". Codes are compared in constant
// time and case-insensitively, so a code written down in lower case still works.
function findInstructor(code) {
    if (!code || typeof code !== 'string') return null;
    const supplied = code.trim().toUpperCase();
    if (!supplied) return null;
    const raw = process.env.INSTRUCTOR_CODES || '';
    let match = null;
    // Walk every entry rather than returning early, so the time taken does not
    // reveal how far down the list a code sits.
    raw.split(',').forEach(pair => {
        const i = pair.indexOf(':');
        if (i < 1) return;
        const name = pair.slice(0, i).trim();
        const expected = pair.slice(i + 1).trim().toUpperCase();
        if (expected && safeEqual(supplied, expected)) match = name;
    });
    return match;
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
    SESSION_HOURS,
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
