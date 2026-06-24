import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../api/client.js';
import PageShell from '../components/PageShell.jsx';
import ImagePicker from '../components/ImagePicker.jsx';
import { BilingualInput } from '../components/LangTabs.jsx';

const SPANS = [1, 2, 3];

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        type="text"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
      />
    </div>
  );
}

function Section({ title }) {
  return <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pt-6 pb-2 border-t border-slate-100">{title}</h2>;
}

export default function PageGallery() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/content/gallery').then(r => setData(r.data)); }, []);

  const setHero  = p => setData(prev => ({ ...prev, hero: { ...prev.hero, ...p } }));

  const setItem  = (i, patch) => setData(prev => {
    const items = [...prev.items];
    items[i] = { ...items[i], ...patch };
    return { ...prev, items };
  });

  const moveUp   = i => setData(prev => {
    if (i === 0) return prev;
    const items = [...prev.items];
    [items[i - 1], items[i]] = [items[i], items[i - 1]];
    return { ...prev, items };
  });

  const moveDown = i => setData(prev => {
    if (i === prev.items.length - 1) return prev;
    const items = [...prev.items];
    [items[i], items[i + 1]] = [items[i + 1], items[i]];
    return { ...prev, items };
  });

  const remove   = i => setData(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const add      = () => setData(prev => ({
    ...prev,
    items: [...prev.items, { image: '', title_it: '', title_en: '', span: 1 }],
  }));

  const save = () => api.put('/content/gallery', data);

  if (!data) return <div className="p-6 text-sm text-slate-400">Caricamento…</div>;

  return (
    <PageShell title="Galleria" subtitle="Hero e griglia fotografica" onSave={save}>
      <div className="space-y-5">

        {/* Hero */}
        <Section title="Hero — immagine e testi" />
        <ImagePicker label="Immagine hero" value={data.hero?.image} onChange={url => setHero({ image: url })} />
        <BilingualInput label="Etichetta" value={data.hero?.label}    onChange={v => setHero({ label: v })} />
        <BilingualInput label="Sottotitolo" value={data.hero?.subtitle} onChange={v => setHero({ subtitle: v })} />

        {/* Gallery grid */}
        <Section title={`Foto in galleria (${data.items?.length ?? 0})`} />

        <div className="space-y-3">
          {(data.items ?? []).map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-start">
              {/* Move up/down */}
              <div className="flex flex-col gap-1 shrink-0 mt-1">
                <button type="button" onClick={() => moveUp(i)}   disabled={i === 0}                       className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"><ChevronUp   size={14} /></button>
                <button type="button" onClick={() => moveDown(i)} disabled={i === data.items.length - 1}   className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"><ChevronDown size={14} /></button>
              </div>

              {/* Image */}
              <div className="shrink-0">
                <ImagePicker value={item.image} onChange={url => setItem(i, { image: url })} />
              </div>

              {/* Fields */}
              <div className="flex-1 space-y-2 min-w-0">
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Didascalia IT" value={item.title_it} onChange={v => setItem(i, { title_it: v })} placeholder="Facoltativa" />
                  <Field label="Didascalia EN" value={item.title_en} onChange={v => setItem(i, { title_en: v })} placeholder="Optional" />
                </div>
                {/* Span selector */}
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Larghezza griglia</label>
                  <div className="flex gap-1">
                    {SPANS.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setItem(i, { span: s })}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                          item.span === s
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {s === 1 ? 'Piccola' : s === 2 ? 'Media' : 'Grande'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delete */}
              <button type="button" onClick={() => remove(i)} className="p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={add}
          className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          <Plus size={15} />
          Aggiungi foto
        </button>

      </div>
    </PageShell>
  );
}
