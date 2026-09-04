// GET /api/admin-logs?days=30
// Owner-only. Returns the access log for a window, already summarised per
// person so the dashboard just renders what it is given.
const auth = require('../lib/auth');
const store = require('../lib/store');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'method_not_allowed' });
    }

    let session;
    try {
        session = auth.sessionFrom(req);
    } catch (e) {
        console.error('admin-logs misconfigured:', e.message);
        return res.status(500).json({ error: 'server_misconfigured' });
    }

    // An instructor session must not be enough to read this.
    if (!session || session.r !== 'owner') {
        return res.status(401).json({ error: 'not_authorised' });
    }

    if (!store.isConfigured()) {
        return res.status(200).json({
            configured: false,
            retentionDays: store.RETENTION_DAYS,
            people: [],
            failures: [],
            note: 'Log store not configured — no history is being recorded yet.'
        });
    }

    const days = Number(req.query?.days) ||
        Number(new URL(req.url, 'http://x').searchParams.get('days')) || 30;

    let rows;
    try {
        rows = await store.readAttempts(days);
    } catch (e) {
        console.error('admin-logs read failed:', e.message);
        return res.status(502).json({ error: 'log_read_failed' });
    }

    const byPerson = new Map();
    const failures = [];

    rows.forEach(r => {
        if (!r.ok) {
            failures.push(r);
            return;
        }
        if (r.kind !== 'instructor') return;          // dashboard logins listed separately
        const key = r.who;
        if (!byPerson.has(key)) {
            byPerson.set(key, {
                who: key, logins: 0, ips: new Set(), towns: new Set(),
                lastSeen: 0, lastPlace: ''
            });
        }
        const p = byPerson.get(key);
        p.logins++;
        if (r.ip) p.ips.add(r.ip);
        // Only count a town when we actually know it — a request that arrives
        // without geo headers must not register as another distinct place.
        const town = [r.city, r.region].filter(Boolean).join(' ');
        if (town) p.towns.add(town);
        if (r.ts > p.lastSeen) {
            p.lastSeen = r.ts;
            p.lastPlace = town || r.country || 'unknown';
        }
    });

    // Flag on distinct TOWNS, not distinct IPs. Plenty of home connections
    // rotate their address, so one instructor working from one house can rack
    // up several IPs in a month and would otherwise look like a shared code.
    // A code genuinely being passed around tends to show up in several towns.
    const TOWN_FLAG_THRESHOLD = 3;

    const people = [...byPerson.values()].map(p => ({
        who: p.who,
        logins: p.logins,
        ipCount: p.ips.size,
        townCount: p.towns.size,
        locations: [...p.towns],
        flagged: p.towns.size >= TOWN_FLAG_THRESHOLD,
        lastSeen: p.lastSeen,
        lastPlace: p.lastPlace
    })).sort((a, b) =>
        (b.flagged - a.flagged) || (b.townCount - a.townCount) || (b.logins - a.logins)
    );

    res.setHeader('Cache-Control', 'no-store, private');
    return res.status(200).json({
        configured: true,
        retentionDays: store.RETENTION_DAYS,
        days,
        people,
        failures: failures.sort((a, b) => b.ts - a.ts).slice(0, 50)
    });
};
