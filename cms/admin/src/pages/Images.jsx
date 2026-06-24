import { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import api from '../api/client.js';
import { useToast } from '../components/Layout.jsx';

export default function Images() {
  const showToast = useToast();
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied,    setCopied]    = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await api.get('/images'); setImages(r.data); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const upload = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const form = new FormData();
        form.append('image', file);
        const r = await api.post('/images/upload', form);
        setImages(prev => [r.data, ...prev]);
      }
      showToast(`${files.length} immagine/i caricata/e`);
    } catch (err) {
      showToast(err.response?.data?.error ?? 'Errore upload', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const remove = async (key) => {
    if (!confirm('Eliminare questa immagine?')) return;
    try {
      await api.delete(`/images/${encodeURIComponent(key)}`);
      setImages(prev => prev.filter(i => i.key !== key));
      showToast('Immagine eliminata');
    } catch {
      showToast('Errore eliminazione', 'error');
    }
  };

  const copy = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1800);
  };

  const fmtSize = n => n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.round(n / 1e3)} KB`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Libreria immagini</h1>
          <p className="text-sm text-slate-500 mt-0.5">{images.length} immagine/i caricate</p>
        </div>
        <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
          uploading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white'
        }`}>
          <Upload size={14} />
          {uploading ? 'Caricamento…' : 'Carica immagini'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={upload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Caricamento…</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-slate-400">Nessuna immagine caricata</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.key} className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="aspect-video bg-slate-100">
                <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-600 truncate">{img.key.replace('uploads/', '')}</p>
                <p className="text-xs text-slate-400">{fmtSize(img.size)}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copy(img.url)}
                  className="p-1.5 bg-white rounded-lg shadow text-slate-600 hover:text-amber-600 transition-colors"
                  title="Copia URL"
                >
                  {copied === img.url ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
                <button
                  onClick={() => remove(img.key)}
                  className="p-1.5 bg-white rounded-lg shadow text-slate-600 hover:text-red-500 transition-colors"
                  title="Elimina"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
