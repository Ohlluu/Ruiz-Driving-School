// POST /api/login  { code }
// Validates an instructor code, starts an 8-hour session, and records the
// attempt (successes and failures alike) in the access log.
const auth = require('../lib/auth');
const store = require('../lib/store');

// Crude in-memory rate limit. Serverless instances come and go, so this is a
// speed bump against a burst from one address, not a guarantee. The real
// protection against guessing is the size of the code space.
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;

function rateLimited(ip) {
    const now = Date.now();
    const seen = (attempts.get(ip) || []).filter(t => now - t < WINDOW_MS);
    seen.push(now);
    attempts.set(ip, seen);
    if (attempts.size > 500) {                       // keep the map from growing
        for (const [k, v] of attempts) {
            if (!v.some(t => now - t < WINDOW_MS)) attempts.delete(k);
        }
    }
    return seen.length > MAX_PER_WINDOW;
}

async function readBody(req) {
    if (req.body) {
        return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks).toString() || '{}';
    return JSON.parse(raw);
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

    let code = '';
    try {
        code = String((await readBody(req)).code || '');
    } catch (e) {
        return res.status(400).json({ error: 'bad_request' });
    }

    let name;
    try {
        name = auth.findInstructor(code);
    } catch (e) {
        console.error('login misconfigured:', e.message);
        return res.status(500).json({ error: 'server_misconfigured' });
    }

    // Log before responding so a failure is recorded even if the caller aborts.
    await store.logAttempt({
        who: name || 'unknown',
        ok: !!name,
        kind: 'instructor',
        ip: origin.ip,
        city: origin.city,
        region: origin.region,
        country: origin.country,
        ua: origin.ua
    });

    if (!name) return res.status(401).json({ error: 'invalid_code' });

    try {
        res.setHeader('Set-Cookie', auth.cookieHeader(auth.createSession(name, 'instructor')));
    } catch (e) {
        console.error('session misconfigured:', e.message);
        return res.status(500).json({ error: 'server_misconfigured' });
    }
    return res.status(200).json({ ok: true, name, hours: auth.SESSION_HOURS });
};
