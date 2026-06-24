const KV_KEY = 'content';

export async function handleContent(request, env, pathname) {
  // pathname: /api/content  or  /api/content/:section
  const section = pathname.replace(/^\/api\/content\/?/, '') || null;

  if (request.method === 'GET') {
    let raw = await env.CMS_KV.get(KV_KEY);
    if (!raw) {
      // First access: seed KV with defaults so the admin loads immediately
      const defaults = defaultContent();
      await env.CMS_KV.put(KV_KEY, JSON.stringify(defaults));
      raw = JSON.stringify(defaults);
    }
    const content = JSON.parse(raw);
    if (!section) return json(content);
    const data = content[section];
    if (!data) return json({ error: `Sezione '${section}' non trovata` }, 404);
    return json(data);
  }

  if (request.method === 'PUT') {
    if (!section) return json({ error: 'Sezione richiesta' }, 400);
    let body;
    try { body = await request.json(); } catch {
      return json({ error: 'JSON non valido' }, 400);
    }
    const raw = await env.CMS_KV.get(KV_KEY);
    const content = raw ? JSON.parse(raw) : defaultContent();
    if (section === 'global') {
      content.global = { ...content.global, ...body };
    } else {
      content[section] = { ...content[section], ...body };
    }
    await env.CMS_KV.put(KV_KEY, JSON.stringify(content));
    return json({ ok: true });
  }

  return json({ error: 'Metodo non supportato' }, 405);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function defaultContent() {
  return {
    global: {
      phone:     '+39 331 147 4808',
      phone_int: '393311474808',
      email:     'carpanelle@gmail.com',
    },
    home: {
      hero: {
        slide1:   'immagini/slide1.jpg',
        slide2:   'immagini/slide2.jpg',
        slide3:   'immagini/slide3.jpg',
        eyebrow:  { it: 'Laterina Pergine Valdarno · Arezzo · Toscana',              en: 'Laterina Pergine Valdarno · Arezzo · Tuscany' },
        title:    'Le <em>Carpanelle</em>',
        subtitle: { it: 'Olio, Miele, Ortaggi ed Ospitalità nel cuore del Valdarno', en: 'Olive Oil, Honey, Vegetables & Hospitality in the heart of the Valdarno' },
      },
      reviews: [
        { text_it: "Posto meraviglioso, immerso nel verde. Claudia è stata un'ospite straordinaria, gentile e attenta a ogni dettaglio. Il miele e l'olio che abbiamo acquistato erano eccezionali.", text_en: 'A wonderful place, surrounded by greenery. Claudia was an extraordinary host, kind and attentive to every detail. The honey and olive oil we bought were exceptional.', author: 'Marco R.', source: 'Google' },
        { text_it: "Un'esperienza autentica nella campagna toscana. La colazione con prodotti locali è stata deliziosa, e il panorama sul Valdarno indimenticabile. Torneremo sicuramente!", text_en: 'An authentic experience in the Tuscan countryside. Breakfast with local produce was delicious, and the views over the Valdarno were unforgettable. We will definitely be back!', author: 'Sophie L.', source: 'Facebook' },
        { text_it: "Accoglienza calorosa, camera pulita e confortevole. I prodotti dell'azienda sono di altissima qualità. Consiglio a tutti di visitare Le Carpanelle!", text_en: "Warm welcome, clean and comfortable room. The farm's products are of the highest quality. I would recommend everyone to visit Le Carpanelle!", author: 'Giulia T.', source: 'Google' },
      ],
    },
    contatti: {
      hero: {
        image: 'immagini/cartelLecarpanelleantiguo.jpg',
        label: { it: 'Dove siamo', en: 'Find us' },
        title: { it: '<em>Contatti</em> e Mappa', en: '<em>Contact</em> & Map' },
      },
    },
    bb: {
      hero: {
        image:    'immagini/B&BClaudia.jpg',
        label:    { it: 'Soggiorno · Laterina Pergine Valdarno', en: 'Stay · Laterina Pergine Valdarno' },
        title:    '<em>Claudia</em> B&B',
        subtitle: { it: 'Due camere nel cuore del Valdarno Toscano', en: 'Two rooms in the heart of the Tuscan Valdarno' },
      },
      prices: {
        it: 'Prezzi soggiorno: camera singola 35€ (senza colazione, disponibile a 5€); Camera doppia 60€ (colazione inclusa). Pagamenti POS accettati.',
        en: 'Accommodation prices: Single room €35 (without breakfast, available at €5); Double room €60 (breakfast included). Card payments accepted.',
      },
      massage: {
        image: 'immagini/massage.jpg',
        title: { it: 'Massaggio <em>rilassante</em> e decontratturante',                                                                           en: 'Relaxing & <em>decontracting</em> massage' },
        body:  { it: 'In un ambiente curato e confortevole, Claudia si prenderà cura dei nostri ospiti con un massaggio rilassante o decontratturante, direttamente in struttura.', en: 'In a carefully furnished and comfortable space, Claudia will take care of you with a relaxing or decontracting massage, directly on site.' },
      },
      gallery: [
        'immagini/bb-gal-1.jpg',
        'immagini/galleria/Claudia-B&B_4.jpg',
        'immagini/bb-gal-3.jpg',
      ],
    },
    gallery: {
      hero: {
        image:    'immagini/miele.jpg',
        label:    { it: 'Galleria · Laterina Pergine Valdarno', en: 'Gallery · Laterina Pergine Valdarno' },
        title:    '<em>Le Carpanelle</em>',
        subtitle: { it: 'La nostra azienda in immagini!', en: 'Photogallery' },
      },
      items: [
        { image: 'immagini/galleria/olive.jpg',                    title_it: 'Le Nostre Olive',       title_en: 'Our Olive Groves',   span: 1 },
        { image: 'immagini/galleria/miele_1.jpg',                  title_it: '',                      title_en: '',                   span: 2 },
        { image: 'immagini/galleria/cartello_B&B.jpg',             title_it: 'Miele Artigianale',     title_en: 'Artisan Honey',      span: 1 },
        { image: 'immagini/galleria/vista_giardino.jpg',           title_it: "L'azienda",             title_en: 'Our Farm',           span: 3 },
        { image: 'immagini/galleria/Olio_bottiglia_etichetta.jpg', title_it: 'Olio artigianale',      title_en: 'Artisan Oil',        span: 1 },
        { image: 'immagini/galleria/cartello_escursioni.jpg',      title_it: "Animale dell'azienda",  title_en: 'Valdarno Landscape', span: 2 },
        { image: 'immagini/galleria/pomodori.jpg',                 title_it: 'Escursioni',            title_en: 'Hiking',             span: 1 },
        { image: 'immagini/galleria/capre.jpg',                    title_it: "L'azienda",             title_en: 'Our Farm',           span: 1 },
        { image: 'immagini/galleria/massaggio_2.jpg',              title_it: 'Castagne',              title_en: 'Chestnuts',          span: 3 },
        { image: 'immagini/galleria/Claudia-B&B_6.jpg',           title_it: "L'Orto Bio",            title_en: 'The Organic Garden', span: 1 },
        { image: 'immagini/galleria/Claudia-B&B_8.jpg',           title_it: "L'Orto bio",            title_en: 'The Organic Garden', span: 3 },
        { image: 'immagini/galleria/api_sciame.jpg',               title_it: 'Valdarno',              title_en: 'Valdarno Landscape', span: 2 },
        { image: 'immagini/galleria/massaggio_1.jpg',              title_it: 'Massaggio',             title_en: 'Massage',            span: 2 },
        { image: 'immagini/galleria/vista_retro.jpg',              title_it: "L'azienda",             title_en: 'Our Farm',           span: 3 },
        { image: 'immagini/galleria/miele_scolatura.jpg',          title_it: 'Miele',                 title_en: 'Honey',              span: 2 },
        { image: 'immagini/galleria/orto.jpg',                     title_it: "L'orto",                title_en: 'The Garden',         span: 1 },
        { image: 'immagini/galleria/ulivi.jpg',                    title_it: 'Ulivi',                 title_en: 'Olive Trees',        span: 3 },
        { image: 'immagini/galleria/castagne.jpg',                 title_it: 'Castagne',              title_en: 'Chestnuts',          span: 1 },
        { image: 'immagini/galleria/miele_etichetta.jpg',          title_it: 'Miele',                 title_en: 'Honey',              span: 2 },
        { image: 'immagini/galleria/Claudia-B&B_tavolo.jpg',      title_it: '',                      title_en: '',                   span: 3 },
        { image: 'immagini/galleria/meloni.jpg',                   title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/piselli.jpg',                  title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/capre_2.jpg',                  title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/melenzana.jpg',                title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/broccoli.jpg',                 title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/funghi.jpg',                   title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/vista_exterior1.jpg',          title_it: '',                      title_en: '',                   span: 3 },
        { image: 'immagini/galleria/fagiolini.jpg',                title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/vista_exterior_2.jpg',         title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/vista_esterna.jpg',            title_it: '',                      title_en: '',                   span: 3 },
        { image: 'immagini/galleria/aglio.jpg',                    title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/casina_api.jpg',               title_it: '',                      title_en: '',                   span: 2 },
        { image: "immagini/galleria/fave&pecorino.jpg",            title_it: '',                      title_en: '',                   span: 2 },
        { image: 'immagini/galleria/patate.jpg',                   title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/Dario_orto.jpg',               title_it: '',                      title_en: '',                   span: 2 },
        { image: 'immagini/galleria/miele_etichetta_tris.jpg',     title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/pomodoro.jpg',                 title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/Claudia_uva.jpg',              title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/aglione.jpg',                  title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/cane.jpg',                     title_it: '',                      title_en: '',                   span: 2 },
        { image: 'immagini/galleria/olive_casette.jpg',            title_it: '',                      title_en: '',                   span: 2 },
        { image: 'immagini/ClaudiaB&B3.jpg',                      title_it: '',                      title_en: '',                   span: 3 },
        { image: 'immagini/galleria/B&BClaudia_9.jpg',            title_it: '',                      title_en: '',                   span: 2 },
        { image: 'immagini/galleria/vista_exterior_orto.jpg',      title_it: '',                      title_en: '',                   span: 1 },
        { image: 'immagini/galleria/uva.jpg',                      title_it: '',                      title_en: '',                   span: 2 },
      ],
    },
  };
}
