// =============================================
// Access log storage (Upstash Redis over its REST API).
//
// Entries live in one sorted set scored by timestamp, which makes "the last 30
// days" a single range query and expiry a single range delete. Pruning runs on
// every write, so the 90-day window maintains itself with no scheduled job.
//
// Uses fetch and nothing else, so there is no dependency to install.
//
// If the store is not configured or is unreachable, logging fails quietly and
// logAttempt returns false. Losing a log line must never stop an instructor
// from starting a test.
// =============================================

const KEY = 'rds:access-log';
const RETENTION_DAYS = 90;

// Vercel names these differently depending on how the database was added —
// the Upstash integration uses UPSTASH_*, while adding Redis through Vercel's
// own Storage tab injects KV_*. Accept either so setup can't fail on a name.
function config() {
    const url = process.env.UPSTASH_REDIS_REST_URL
        || process.env.KV_REST_API_URL
        || process.env.REDIS_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
        || process.env.KV_REST_API_TOKEN
        || process.env.REDIS_REST_API_TOKEN;
    if (!url || !token) return null;
    return { url: url.replace(/\/+$/, ''), token };
}

function isConfigured() {
    return !!config();
}

// Upstash takes a command as a JSON array in the POST body, which avoids having
// to url-encode JSON payloads into a path.
async function command(args) {
    const cfg = config();
    if (!cfg) return null;
    const res = await fetch(cfg.url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${cfg.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
    });
    if (!res.ok) {
        throw new Error(`Upstash ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }
    const json = await res.json();
    if (json.error) throw new Error(`Upstash: ${json.error}`);
    return json.result;
}

async function logAttempt(entry) {
    if (!isConfigured()) return false;
    const ts = entry.ts || Date.now();
    const record = JSON.stringify({ ...entry, ts });
    try {
        await command(['ZADD', KEY, String(ts), record]);
        // Keep the window trimmed on write rather than on a schedule.
        const cutoff = ts - RETENTION_DAYS * 86400 * 1000;
        await command(['ZREMRANGEBYSCORE', KEY, '-inf', String(cutoff)]);
        return true;
    } catch (e) {
        console.error('access log write failed:', e.message);
        return false;
    }
}

async function readAttempts(days) {
    if (!isConfigured()) return null;
    const window = Math.min(Math.max(Number(days) || 30, 1), RETENTION_DAYS);
    const from = Date.now() - window * 86400 * 1000;
    const rows = await command(['ZRANGEBYSCORE', KEY, String(from), '+inf']);
    return (rows || []).map(r => {
        try { return JSON.parse(r); } catch (e) { return null; }
    }).filter(Boolean);
}

module.exports = { logAttempt, readAttempts, isConfigured, RETENTION_DAYS };
