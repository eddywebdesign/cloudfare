import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api/client.js';
import PageShell from '../components/PageShell.jsx';
import ImagePicker from '../components/ImagePicker.jsx';
import { BilingualInput, BilingualTextarea, TitleField } from '../components/LangTabs.jsx';

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type="text"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
      />
    </div>
  );
}

function Section({ title }) {
  return <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pt-6 pb-2 border-t border-slate-100">{title}</h2>;
}

export default function PageHome() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/content/home').then(r => setData(r.data));
  }, []);

  const set = patch => setData(prev => ({ ...prev, ...patch }));
  const setHero = patch => setData(prev => ({ ...prev, hero: { ...prev.hero, ...patch } }));

  const setReview = (i, patch) => setData(prev => {
    const reviews = [...prev.reviews];
    reviews[i] = { ...reviews[i], ...patch };
    return { ...prev, reviews };
  });

  const addReview = () => setData(prev => ({
    ...prev,
    reviews: [...(prev.reviews ?? []), { text_it: '', text_en: '', author: '', source: 'Google' }],
  }));

  const removeReview = (i) => setData(prev => {
    const reviews = prev.reviews.filter((_, idx) => idx !== i);
    return { ...prev, reviews };
  });

  const save = () => api.put('/content/home', data);

  if (!data) return <div className="p-6 text-sm text-slate-400">Caricamento…</div>;

  return (
    <PageShell title="Homepage" subtitle="Hero slider e recensioni" onSave={save}>
      <div className="space-y-5">

        {/* Hero images */}
        <Section title="Slider — immagini hero" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(n => (
            <ImagePicker
              key={n}
              label={`Slide ${n}`}
              value={data.hero?.[`slide${n}`]}
              onChange={url => setHero({ [`slide${n}`]: url })}
            />
          ))}
        </div>

        {/* Hero text */}
        <Section title="Testo hero" />
        <BilingualInput
          label="Sottotitolo sopra il titolo (eyebrow)"
          value={data.hero?.eyebrow}
          onChange={v => setHero({ eyebrow: v })}
        />
        <TitleField
          label="Titolo principale (uguale in IT e EN)"
          value={data.hero?.title}
          onChange={v => setHero({ title: v })}
        />
        <BilingualInput
          label="Sottotitolo hero"
          value={data.hero?.subtitle}
          onChange={v => setHero({ subtitle: v })}
        />

        {/* Reviews */}
        <Section title="Recensioni" />
        <div className="space-y-4">
          {(data.reviews ?? []).map((r, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recensione {i + 1}</span>
                <button type="button" onClick={() => removeReview(i)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <BilingualTextarea
                label="Testo recensione"
                value={{ it: r.text_it, en: r.text_en }}
                onChange={v => setReview(i, { text_it: v.it, text_en: v.en })}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Autore" value={r.author} onChange={v => setReview(i, { author: v })} />
                <Field label="Fonte (es. Google)" value={r.source} onChange={v => setReview(i, { source: v })} />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addReview}
          className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          <Plus size={15} />
          Aggiungi recensione
        </button>

      </div>
    </PageShell>
  );
}
