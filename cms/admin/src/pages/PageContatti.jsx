import { useState, useEffect } from 'react';
import api from '../api/client.js';
import PageShell from '../components/PageShell.jsx';
import ImagePicker from '../components/ImagePicker.jsx';
import { BilingualInput } from '../components/LangTabs.jsx';

export default function PageContatti() {
  const [data, setData] = useState(null);

  useEffect(() => { api.get('/content/contatti').then(r => setData(r.data)); }, []);

  const setHero = p => setData(prev => ({ ...prev, hero: { ...prev.hero, ...p } }));
  const save    = () => api.put('/content/contatti', data);

  if (!data) return <div className="p-6 text-sm text-slate-400">Caricamento…</div>;

  return (
    <PageShell title="Contatti" subtitle="Immagine e testi dell'hero" onSave={save}>
      <div className="space-y-5">
        <ImagePicker label="Immagine hero" value={data.hero?.image} onChange={url => setHero({ image: url })} />
        <BilingualInput label="Etichetta sopra il titolo" value={data.hero?.label} onChange={v => setHero({ label: v })} />
        <BilingualInput label="Titolo" value={data.hero?.title} onChange={v => setHero({ title: v })} />
        <p className="text-xs text-slate-400 pt-2">
          Telefono ed email si modificano in <strong>Impostazioni</strong> — cambiano su tutte le pagine.
        </p>
      </div>
    </PageShell>
  );
}
