// =============================================
// Local development server. NOT used in production — Vercel serves the static
// files and runs everything in /api itself.
//
// Run it to try the code gate and the dashboard on your own machine:
//     node dev-server.js
//     open http://localhost:3000
//
// It does three things Vercel does for us in production:
//   1. serves the static files
//   2. routes /api/<name> to api/<name>.js with a Vercel-shaped req/res
//   3. stands in for Upstash, so the access log works locally
//
// Dev credentials below are deliberately obvious and are only used when the
// real environment variables are absent.
// =============================================
const http = require('http');
const fs = require('fs');
const path = require('path');

// 4310 rather than 3000, which tends to be taken by other projects.
// Override with PORT=xxxx node dev-server.js
const PORT = process.env.PORT || 4310;
const ROOT = __dirname;

// ---- dev-only defaults -------------------------------------------------
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-not-for-production-use';
process.env.INSTRUCTOR_CODES = process.env.INSTRUCTOR_CODES || 'Julio:DEVJULI,Sergio:DEVSERG,Arnold:DEVARNO,Jorge:DEVJORG';
process.env.OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'dev-owner-password';
process.env.UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || `http://127.0.0.1:${PORT}/__upstash`;
process.env.UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'dev-token';

// ---- in-memory stand-in for the Upstash sorted set ---------------------
const zset = [];   // [{ score, member }]

function fakeUpstash(args) {
    const cmd = String(args[0] || '').toUpperCase();
    if (cmd === 'ZADD') {
        const [, , score, member] = args;
        const existing = zset.find(e => e.member === member);
        if (existing) { existing.score = Number(score); return 0; }
        zset.push({ score: Number(score), member });
        return 1;
    }
    if (cmd === 'ZREMRANGEBYSCORE') {
        const max = args[3] === '+inf' ? Infinity : Number(args[3]);
        const min = args[2] === '-inf' ? -Infinity : Number(args[2]);
        let removed = 0;
        for (let i = zset.length - 1; i >= 0; i--) {
            if (zset[i].score >= min && zset[i].score <= max) { zset.splice(i, 1); removed++; }
        }
        return removed;
    }
    if (cmd === 'ZRANGEBYSCORE') {
        const min = args[2] === '-inf' ? -Infinity : Number(args[2]);
        const max = args[3] === '+inf' ? Infinity : Number(args[3]);
        return zset.filter(e => e.score >= min && e.score <= max)
            .sort((a, b) => a.score - b.score)
            .map(e => e.member);
    }
    throw new Error('fake upstash: unsupported command ' + cmd);
}

// ---- static files ------------------------------------------------------
const TYPES = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
    '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.mov': 'video/quicktime',
    '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml'
};

function serveStatic(req, res, pathname) {
    let rel = decodeURIComponent(pathname).replace(/^\/+/, '');
    if (rel === '') rel = 'index.html';
    if (rel === 'admin') rel = 'admin.html';                 // Vercel's clean URL
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) { res.statusCode = 403; return res.end('forbidden'); }
    // Never serve the server-side pieces, mirroring what Vercel does.
    if (/^api\//.test(rel) || rel === 'dev-server.js') {
        res.statusCode = 404; return res.end('not found');
    }
    fs.readFile(file, (err, buf) => {
        if (err) { res.statusCode = 404; return res.end('not found'); }
        res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
        res.end(buf);
    });
}

// ---- give req/res the shape Vercel handlers expect ---------------------
function adapt(req, res, url) {
    req.query = Object.fromEntries(url.searchParams.entries());
    res.status = code => { res.statusCode = code; return res; };
    res.json = obj => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(obj));
        return res;
    };
    // Local requests are http, so drop Secure or the browser discards the cookie.
    const origSetHeader = res.setHeader.bind(res);
    res.setHeader = (name, value) => {
        if (String(name).toLowerCase() === 'set-cookie' && typeof value === 'string') {
            value = value.replace(/;\s*Secure/i, '');
        }
        return origSetHeader(name, value);
    };
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname === '/__upstash') {
        const chunks = [];
        for await (const c of req) chunks.push(c);
        try {
            const args = JSON.parse(Buffer.concat(chunks).toString() || '[]');
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ result: fakeUpstash(args) }));
        } catch (e) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: e.message }));
        }
    }

    if (url.pathname.startsWith('/api/')) {
        const name = url.pathname.slice(5).replace(/[^a-z0-9-]/gi, '');
        // Vercel does not route files under /api whose name starts with an
        // underscore, so neither do we.
        if (name.startsWith('_')) { res.statusCode = 404; return res.end('not found'); }
        const mod = path.join(ROOT, 'api', name + '.js');
        if (!fs.existsSync(mod)) { res.statusCode = 404; return res.end('no such endpoint'); }
        adapt(req, res, url);
        try {
            delete require.cache[require.resolve(mod)];        // pick up edits
            await require(mod)(req, res);
        } catch (e) {
            console.error(`api/${name} threw:`, e);
            if (!res.headersSent) { res.statusCode = 500; res.end(JSON.stringify({ error: 'handler_threw', message: e.message })); }
        }
        return;
    }

    serveStatic(req, res, url.pathname);
});

server.listen(PORT, () => {
    console.log(`dev server on http://localhost:${PORT}`);
    console.log(`  codes: ${process.env.INSTRUCTOR_CODES}`);
    console.log(`  owner password: ${process.env.OWNER_PASSWORD}`);
    console.log(`  dashboard: http://localhost:${PORT}/admin`);
});
