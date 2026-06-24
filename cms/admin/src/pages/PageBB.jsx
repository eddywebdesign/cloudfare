import { useState, useEffect } from 'react';
import api from '../api/client.js';
import PageShell from '../components/PageShell.jsx';
import ImagePicker from '../components/ImagePicker.jsx';
import { BilingualInput, BilingualTextarea, TitleField, BilingualTitle } from '../components/LangTabs.jsx';

function Section({ title }) {
  return <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pt-6 pb-2 border-t border-slate-100">{title}</h2>;
}

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

export default function PageBB() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/content/bb').then(r => setData(r.data)); }, []);

  const setHero    = p => setData(prev => ({ ...prev, hero:    { ...prev.hero,    ...p } }));
  const setPrices  = p => setData(prev => ({ ...prev, prices:  { ...prev.prices,  ...p } }));
  const setMassage = p => setData(prev => ({ ...prev, massage: { ...prev.massage, ...p } }));
  const setGal     = (i, url) => setData(prev => {
    const gallery = [...(prev.gallery ?? [])];
    gallery[i] = url;
    return { ...prev, gallery };
  });

  const save = () => api.put('/content/bb', data);

  if (!data) return <div className="p-6 text-sm text-slate-400">Caricamento…</div>;

  return (
    <PageShell title="Claudia B&B" subtitle="Hero, prezzi, massaggio e gallery strip" onSave={save}>
      <div className="space-y-5">

        {/* Hero */}
        <Section title="Hero — immagine e testi" />
        <ImagePicker label="Immagine hero" value={data.hero?.image} onChange={url => setHero({ image: url })} />
        <BilingualInput label="Etichetta sopra il titolo" value={data.hero?.label} onChange={v => setHero({ label: v })} />
        <TitleField label="Titolo (uguale IT e EN)" value={data.hero?.title} onChange={v => setHero({ title: v })} />
        <BilingualInput label="Sottotitolo" value={data.hero?.subtitle} onChange={v => setHero({ subtitle: v })} />

        {/* Prices */}
        <Section title="Prezzi camere" />
        <BilingualTextarea
          label="Testo prezzi"
          value={data.prices}
          onChange={v => setPrices(v)}
          rows={3}
          placeholder="es. Camera singola 35€; Camera doppia 60€…"
        />

        {/* Massage */}
        <Section title="Sezione massaggio" />
        <ImagePicker label="Immagine massaggio" value={data.massage?.image} onChange={url => setMassage({ image: url })} />
        <BilingualTitle label="Titolo" value={data.massage?.title} onChange={v => setMassage({ title: v })} />
        <BilingualTextarea label="Testo descrizione" value={data.massage?.body} onChange={v => setMassage({ body: v })} rows={3} />

        {/* Gallery strip */}
        <Section title="Gallery strip (3 foto)" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <ImagePicker
              key={i}
              label={`Foto ${i + 1}`}
              value={data.gallery?.[i]}
              onChange={url => setGal(i, url)}
            />
          ))}
        </div>

      </div>
    </PageShell>
  );
}
