import { applyContent } from '../_shared/patch.js';

const KV_KEY    = 'content';
const GH_FILE   = 'index.html';
const GH_BRANCH = 'main';

export async function handlePublish(request, env) {
  // Load draft content from KV
  const raw = await env.CMS_KV.get(KV_KEY);
  if (!raw) return json({ error: 'Nessun contenuto in KV. Esegui prima GET /api/content.' }, 400);
  const content = JSON.parse(raw);

  const owner = env.GITHUB_OWNER ?? 'eddywebdesign';
  const repo  = env.GITHUB_REPO  ?? 'cloudfare';
  const ghHeaders = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'lecarpanelle-cms/1.0',
  };

  // 1. Fetch current file + SHA from GitHub
  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${GH_FILE}?ref=${GH_BRANCH}`,
    { headers: ghHeaders }
  );
  if (!getRes.ok) {
    return json({ error: `GitHub GET fallito (${getRes.status}): ${await getRes.text()}` }, 502);
  }
  const ghData = await getRes.json();

  // 2. Decode → patch → re-encode (UTF-8 safe)
  const htmlOriginal = decodeBase64(ghData.content);
  const htmlPatched  = applyContent(htmlOriginal, content);
  const encoded      = encodeBase64(htmlPatched);

  // 3. Commit back
  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${GH_FILE}`,
    {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `CMS: aggiornamento ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
        content: encoded,
        sha:     ghData.sha,
        branch:  GH_BRANCH,
      }),
    }
  );
  if (!putRes.ok) {
    return json({ error: `GitHub PUT fallito (${putRes.status}): ${await putRes.text()}` }, 502);
  }

  const result = await putRes.json();
  return json({
    ok: true,
    message: 'Pubblicato. Cloudflare Pages ridistribuisce automaticamente.',
    commit:  result.commit?.sha?.slice(0, 7),
  });
}

// UTF-8 safe base64 decode/encode (GitHub content may contain non-ASCII)
function decodeBase64(b64) {
  const binary = atob(b64.replace(/\n/g, ''));
  const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeBase64(str) {
  const bytes  = new TextEncoder().encode(str);
  let binary   = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
