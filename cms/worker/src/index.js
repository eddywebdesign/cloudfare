import { verifyJWT, extractToken } from './_shared/jwt.js';
import { handleLogin }   from './routes/auth.js';
import { handleContent } from './routes/content.js';
import { handlePublish } from './routes/publish.js';
import { handleImages }  from './routes/images.js';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Public routes (no JWT required)
const PUBLIC = ['/api/auth/login'];

export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const path = url.pathname;

    // ── CORS preflight ──────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    try {
      // ── Auth gate ─────────────────────────────────────────────────────────
      if (!PUBLIC.includes(path)) {
        const token = extractToken(request);
        if (!token) return err('Token mancante', 401);
        await verifyJWT(token, env.JWT_SECRET); // throws if invalid/expired
      }

      // ── Route dispatch ────────────────────────────────────────────────────
      if (path === '/api/auth/login')           return addCors(await handleLogin(request, env));
      if (path === '/api/auth/verify')          return addCors(json({ ok: true }));
      if (path.startsWith('/api/content'))      return addCors(await handleContent(request, env, path));
      if (path === '/api/publish')              return addCors(await handlePublish(request, env));
      if (path.startsWith('/api/images'))       return addCors(await handleImages(request, env, path));

      return err('Route non trovata', 404);

    } catch (e) {
      // JWT errors arrive here
      if (/token|firma|scaduto/i.test(e.message)) return err(e.message, 401);
      console.error(e);
      return err('Errore interno del server', 500);
    }
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function err(message, status) {
  return addCors(json({ error: message }, status));
}

function addCors(response) {
  const r = new Response(response.body, response);
  for (const [k, v] of Object.entries(CORS)) r.headers.set(k, v);
  return r;
}
