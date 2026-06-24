const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED  = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const EXT_MAP  = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };

export async function handleImages(request, env, pathname) {
  const isUpload = pathname.endsWith('/upload');

  // GET /api/images → list
  if (request.method === 'GET' && !isUpload) {
    const listed  = await env.CMS_R2.list({ limit: 500 });
    const pubBase = (env.R2_PUBLIC_URL ?? '').replace(/\/$/, '');
    const files   = listed.objects
      .map(o => ({ key: o.key, url: `${pubBase}/${o.key}`, size: o.size, uploaded: o.uploaded }))
      .sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));
    return json(files);
  }

  // POST /api/images/upload
  if (request.method === 'POST' && isUpload) {
    let form;
    try { form = await request.formData(); } catch {
      return json({ error: 'Richiesta multipart non valida' }, 400);
    }
    const file = form.get('image');
    if (!file || typeof file === 'string') return json({ error: 'Campo "image" mancante' }, 400);
    if (!ALLOWED.has(file.type))           return json({ error: 'Tipo file non supportato' }, 415);

    const buf = await file.arrayBuffer();
    if (buf.byteLength > MAX_SIZE) return json({ error: 'File troppo grande (max 8 MB)' }, 413);

    const base = (file.name ?? 'upload')
      .replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 60);
    const ext  = EXT_MAP[file.type] ?? 'jpg';
    const key  = `uploads/${base}-${Date.now()}.${ext}`;

    await env.CMS_R2.put(key, buf, { httpMetadata: { contentType: file.type } });

    const pubBase = (env.R2_PUBLIC_URL ?? '').replace(/\/$/, '');
    return json({ ok: true, key, url: `${pubBase}/${key}` }, 201);
  }

  // DELETE /api/images/:key
  if (request.method === 'DELETE') {
    const key = pathname.replace(/^\/api\/images\//, '');
    if (!key) return json({ error: 'Chiave mancante' }, 400);
    await env.CMS_R2.delete(key);
    return json({ ok: true });
  }

  return json({ error: 'Metodo non supportato' }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
