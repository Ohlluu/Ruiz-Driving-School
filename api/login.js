// POST /api/login  { code }
// Validates an instructor code and returns the question banks in the same
// response. No session and no cookie: a code is typed every time a test is
// opened, so there is nothing persisted that could be replayed or shared.
//
// A side benefit is that every test opening becomes its own log entry, which
// gives the dashboard far more to work with than one login per shift.
const auth = require('./_lib/auth');
const store = require('./_lib/store');
const { TESTS } = require('./_lib/questions');

// Rate limiting counts FAILURES only. Everyone at the school shares one
// address, so counting successes would lock out a busy office rather than an
// attacker. Wrong codes are what needs throttling.
const failures = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 10;

function recentFailures(ip) {
    const now = Date.now();
    const seen = (failures.get(ip) || []).filter(t => now - t < WINDOW_MS);
    if (seen.length) failures.set(ip, seen); else failures.delete(ip);
    return seen.length;
}

function noteFailure(ip) {
    const now = Date.now();
    const seen = (failures.get(ip) || []).filter(t => now - t < WINDOW_MS);
    seen.push(now);
    failures.set(ip, seen);
    if (failures.size > 500) {
        for (const [k, v] of failures) {
            if (!v.some(t => now - t < WINDOW_MS)) failures.delete(k);
        }
    }
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

    // The throttle is checked only once a code has already been rejected, never
    // before. A correct code always gets through, so one person's run of typos
    // cannot lock out the rest of the office sharing the same address. Guessing
    // is still throttled, and it was never viable anyway: seven characters from
    // a 29-character alphabet is about 17 billion combinations.
    if (!name) {
        noteFailure(origin.ip);
        if (recentFailures(origin.ip) > MAX_FAILURES) {
            return res.status(429).json({ error: 'too_many_attempts' });
        }
        return res.status(401).json({ error: 'invalid_code' });
    }

    // Questions travel with the successful response. Never cached — this is the
    // answer key, and it should not sit in a proxy or the browser's disk cache.
    res.setHeader('Cache-Control', 'no-store, private');
    return res.status(200).json({ ok: true, name, tests: TESTS });
};
