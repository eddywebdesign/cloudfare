import { signJWT } from '../_shared/jwt.js';

export async function handleLogin(request, env) {
  let body;
  try { body = await request.json(); } catch {
    return json({ error: 'JSON non valido' }, 400);
  }
  const { username, password } = body ?? {};
  if (!username || !password) return json({ error: 'Credenziali mancanti' }, 400);

  const ok = await timingSafeEqual(username, env.ADMIN_USERNAME ?? '')
    && await timingSafeEqual(password, env.ADMIN_PASSWORD ?? '');

  if (!ok) return json({ error: 'Credenziali non valide' }, 401);

  const token = await signJWT({ sub: username }, env.JWT_SECRET);
  return json({ token });
}

async function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode('cms-compare'),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const [sigA, sigB] = await Promise.all([
    crypto.subtle.sign('HMAC', key, enc.encode(a)),
    crypto.subtle.sign('HMAC', key, enc.encode(b)),
  ]);
  if (a.length !== b.length) return false;
  const va = new Uint8Array(sigA), vb = new Uint8Array(sigB);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
