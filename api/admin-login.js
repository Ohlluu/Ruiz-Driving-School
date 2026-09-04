// POST /api/admin-login  { password }
// Owner-only. Separate credential from the instructor codes, so an instructor
// code can never reach the dashboard.
const auth = require('../lib/auth');
const store = require('../lib/store');

const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;

function rateLimited(ip) {
    const now = Date.now();
    const seen = (attempts.get(ip) || []).filter(t => now - t < WINDOW_MS);
    seen.push(now);
    attempts.set(ip, seen);
    return seen.length > MAX_PER_WINDOW;
}

async function readBody(req) {
    if (req.body) {
        return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
    const chunks = [];
    for await (const c of req) chunks.push(c);
    return JSON.parse(Buffer.concat(chunks).toString() || '{}');
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'method_not_allowed' });
    }

    const origin = auth.requestOrigin(req);
    if (rateLimited(origin.ip)) {
        return res.status(429).json({ error: 'too_many_attempts' });
    }

    let password = '';
    try {
        password = String((await readBody(req)).password || '');
    } catch (e) {
        return res.status(400).json({ error: 'bad_request' });
    }

    const ok = auth.checkOwner(password);

    await store.logAttempt({
        who: 'owner',
        ok,
        kind: 'dashboard',
        ip: origin.ip,
        city: origin.city,
        region: origin.region,
        country: origin.country,
        ua: origin.ua
    });

    if (!ok) return res.status(401).json({ error: 'invalid_password' });

    try {
        res.setHeader('Set-Cookie', auth.cookieHeader(auth.createSession('owner', 'owner')));
    } catch (e) {
        console.error('session misconfigured:', e.message);
        return res.status(500).json({ error: 'server_misconfigured' });
    }
    return res.status(200).json({ ok: true });
};
