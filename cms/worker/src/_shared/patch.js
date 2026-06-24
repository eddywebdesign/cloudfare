// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Assembles a title from { before, accent, after } → "before <em>accent</em> after"
// Accepts legacy plain strings too (backward compat).
function buildTitle(t) {
  if (!t) return '';
  if (typeof t === 'string') return t;
  const before = (t.before ?? '').trim();
  const accent = (t.accent ?? '').trim();
  const after  = (t.after  ?? '').trim();
  const parts  = [];
  if (before) parts.push(before);
  if (accent) parts.push(`<em>${accent}</em>`);
  if (after)  parts.push(after);
  return parts.join(' ');
}

// ── Text fields (data-cms-field) ──────────────────────────────────────────────
// Updates data-it, data-en attributes AND visible text content.
// The client enters plain text; the CSS handles all visual styling.
// Newlines entered by the client become <br> in the HTML.
function patchTextField(html, field, valueIt, valueEn) {
  // Capture the tag name so the closing tag backreference is exact
  const re = new RegExp(
    `(<(h[1-6]|p|span)(?:[^>]*?)data-cms-field="${esc(field)}"(?:[^>]*?)>)[\\s\\S]*?(<\\/\\2>)`,
    'i'
  );
  return html.replace(re, (_, openTag, _tag, closeTag) => {
    let tag = openTag;
    if (tag.includes('data-it=')) tag = tag.replace(/data-it="[^"]*"/, `data-it="${valueIt}"`);
    if (tag.includes('data-en=')) tag = tag.replace(/data-en="[^"]*"/, `data-en="${valueEn}"`);
    return `${tag}${valueEn}${closeTag}`;
  });
}

// ── CSS background-image rules (in <style> block) ─────────────────────────────
// Patches the url() inside a CSS class rule; works for hero sections and
// the bb-gallery strip where background-image is set via a CSS class.
function patchCssImage(html, cssClass, imageUrl) {
  // cssClass is the bare class name without the dot, e.g. 'slide-1'
  const re = new RegExp(
    `(\\.${esc(cssClass)}\\s*\\{[^}]*background-image:\\s*url\\()['"]?[^'"\\)\\s]*['"]?`
  );
  return html.replace(re, `$1'${imageUrl}'`);
}

// ── Global contact info ────────────────────────────────────────────────────────
function patchGlobal(html, global) {
  const OLD_PHONE_INT  = '393311474808';
  const OLD_PHONE_DISP = '+39 331 147 4808';
  const OLD_EMAIL      = 'carpanelle@gmail.com';

  if (global.phone_int) {
    html = html.split(OLD_PHONE_INT).join(global.phone_int);
    html = html.split(OLD_PHONE_DISP).join(global.phone);
  }
  if (global.email) {
    html = html.split(OLD_EMAIL).join(global.email);
  }
  return html;
}

// ── Reviews block (CMS:REVIEWS_START/END) ─────────────────────────────────────
function patchReviews(html, reviews) {
  const cards = reviews.map(r => `    <div class="review-card">
      <div class="review-quote">"</div>
      <div class="review-stars">★★★★★</div>
      <p class="review-text" data-it="${r.text_it}" data-en="${r.text_en}">${r.text_en}</p>
      <p class="review-author">${r.author}</p>
      <p class="review-source">${r.source}</p>
    </div>`).join('\n');

  return html.replace(
    /<!-- CMS:REVIEWS_START -->[\s\S]*?<!-- CMS:REVIEWS_END -->/,
    `<!-- CMS:REVIEWS_START -->\n  <div class="reviews-grid">\n${cards}\n  </div>\n<!-- CMS:REVIEWS_END -->`
  );
}

// ── Gallery grid (CMS:GALLERY_GRID_START/END) ──────────────────────────────────
function patchGalleryGrid(html, items) {
  const blocks = items.map(item => {
    const titleAttr = (item.title_it || item.title_en)
      ? `\n<h3 class="gallery-title" data-it="${item.title_it || ''}" data-en="${item.title_en || ''}">${item.title_en || ''}</h3>`
      : '';
    return `<div class="gallery-item span-${item.span}">
<div class="gallery-bg" style="background-image: url('${item.image}');"></div>${titleAttr}
</div>`;
  }).join('\n\n');

  return html.replace(
    /<!-- CMS:GALLERY_GRID_START -->[\s\S]*?<!-- CMS:GALLERY_GRID_END -->/,
    `<!-- CMS:GALLERY_GRID_START -->\n<div class="gallery-grid">\n\n${blocks}\n\n</div> <!--- end gallery-grid -->\n<!-- CMS:GALLERY_GRID_END -->`
  );
}

// ── Main: apply full content object to HTML string ────────────────────────────
export function applyContent(html, content) {
  // Global: phone & email across entire file
  if (content.global) html = patchGlobal(html, content.global);

  // HOME ── hero text + slider images
  const h = content.home?.hero ?? {};
  if (h.eyebrow)  html = patchTextField(html, 'home.hero.eyebrow', h.eyebrow.it,  h.eyebrow.en);
  if (h.title) {
    const t = buildTitle(h.title);
    html = patchTextField(html, 'home.hero.title', t, t);
  }
  if (h.subtitle) html = patchTextField(html, 'home.hero.subtitle',h.subtitle.it,  h.subtitle.en);
  if (h.slide1)   html = patchCssImage(html, 'slide-1', h.slide1);
  if (h.slide2)   html = patchCssImage(html, 'slide-2', h.slide2);
  if (h.slide3)   html = patchCssImage(html, 'slide-3', h.slide3);

  // HOME ── reviews
  if (content.home?.reviews?.length) html = patchReviews(html, content.home.reviews);

  // CONTATTI ── hero
  const c = content.contatti?.hero ?? {};
  if (c.image) html = patchCssImage(html, 'contatti-hero', c.image);
  if (c.label) html = patchTextField(html, 'contatti.hero.label', c.label.it, c.label.en);
  if (c.title) {
    const tIt = buildTitle(c.title.it ?? c.title);
    const tEn = buildTitle(c.title.en ?? c.title);
    html = patchTextField(html, 'contatti.hero.title', tIt, tEn);
  }

  // BB ── hero
  const b = content.bb?.hero ?? {};
  if (b.image)    html = patchCssImage(html, 'bb-page-hero', b.image);
  if (b.label)    html = patchTextField(html, 'bb.hero.label',    b.label.it,    b.label.en);
  if (b.title) {
    const t = buildTitle(b.title);
    html = patchTextField(html, 'bb.hero.title', t, t);
  }
  if (b.subtitle) html = patchTextField(html, 'bb.hero.subtitle', b.subtitle.it, b.subtitle.en);

  // BB ── prices
  if (content.bb?.prices) {
    html = patchTextField(html, 'bb.prices', content.bb.prices.it, content.bb.prices.en);
  }

  // BB ── massage
  const m = content.bb?.massage ?? {};
  if (m.image) html = patchCssImage(html, 'massage-image', m.image);
  if (m.title) {
    const tIt = buildTitle(m.title.it ?? m.title);
    const tEn = buildTitle(m.title.en ?? m.title);
    html = patchTextField(html, 'bb.massage.title', tIt, tEn);
  }
  if (m.body)  html = patchTextField(html, 'bb.massage.body',  m.body.it,  m.body.en);

  // BB ── gallery strip (3 images)
  const bg = content.bb?.gallery ?? [];
  if (bg[0]) html = patchCssImage(html, 'bb-gal-1', bg[0]);
  if (bg[1]) html = patchCssImage(html, 'bb-gal-2', bg[1]);
  if (bg[2]) html = patchCssImage(html, 'bb-gal-3', bg[2]);

  // GALLERY ── hero
  const g = content.gallery?.hero ?? {};
  if (g.image)    html = patchCssImage(html, 'gg-page-hero', g.image);
  if (g.label)    html = patchTextField(html, 'gallery.hero.label',    g.label.it,    g.label.en);
  if (g.title) {
    const t = buildTitle(g.title);
    html = patchTextField(html, 'gallery.hero.title', t, t);
  }
  if (g.subtitle) html = patchTextField(html, 'gallery.hero.subtitle', g.subtitle.it, g.subtitle.en);

  // GALLERY ── grid items (add/remove photos)
  if (content.gallery?.items?.length) html = patchGalleryGrid(html, content.gallery.items);

  return html;
}
