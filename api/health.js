// GET /api/health
// Setup check. Reports whether each piece of configuration is present, and
// never the values — no code, password or secret is ever returned. Instructor
// first names and code lengths are included because they are what make a
// mangled paste obvious, and neither is a credential on its own.
const auth = require('../lib/auth');
const store = require('../lib/store');

module.exports = async (req, res) => {
    const cfg = auth.configReport();

    let logStore = { configured: store.isConfigured(), reachable: null };
    if (logStore.configured) {
        try {
            await store.readAttempts(1);
            logStore.reachable = true;
        } catch (e) {
            logStore.reachable = false;
            logStore.error = e.message.slice(0, 120);
        }
    }

    const ready = cfg.sessionSecret && cfg.instructorCodes && cfg.ownerPassword;

    const problems = [];
    if (!cfg.sessionSecret) {
        problems.push(cfg.sessionSecretTooShort
            ? 'SESSION_SECRET is set but shorter than 16 characters'
            : 'SESSION_SECRET is missing');
    }
    if (!cfg.instructorCodes) problems.push('INSTRUCTOR_CODES is missing or could not be parsed');
    if (!cfg.ownerPassword) problems.push('OWNER_PASSWORD is missing');
    if (logStore.configured && logStore.reachable === false) {
        problems.push('log store is configured but unreachable');
    }
    if (!logStore.configured) {
        problems.push('log store not configured — logins will work, but nothing is recorded');
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
        ready,
        problems,
        config: cfg,
        logStore,
        // Confirms the deployment is reading geo headers, which the dashboard
        // needs for its "towns" count.
        sawGeoHeaders: !!(req.headers['x-vercel-ip-country'] || req.headers['x-vercel-ip-city'])
    });
};
