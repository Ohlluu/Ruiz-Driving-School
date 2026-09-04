// GET /api/questions
// The question banks, returned only to a request carrying a valid session.
// This is what makes the code gate real: without a session the answer keys are
// never sent to the browser at all.
const auth = require('../lib/auth');
const { TESTS } = require('../lib/questions');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'method_not_allowed' });
    }

    let session;
    try {
        session = auth.sessionFrom(req);
    } catch (e) {
        console.error('questions misconfigured:', e.message);
        return res.status(500).json({ error: 'server_misconfigured' });
    }

    if (!session) return res.status(401).json({ error: 'not_authenticated' });

    // Never cached by a proxy or the browser — this is per-session content.
    res.setHeader('Cache-Control', 'no-store, private');
    return res.status(200).json({ who: session.n, tests: TESTS });
};
