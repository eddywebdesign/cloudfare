import { useState, useCallback } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../api/client.js';

// Site images are stored as relative paths (immagini/slide1.jpg).
// When the CMS admin runs at /cms/, relative URLs break — prefix with / to resolve from root.
function toPreviewUrl(v) {
  if (!v) return '';
  if (v.startsWith('http') || v.startsWith('/')) return v;
  return `/${v}`;
}

export default function ImagePicker({ label, value, onChange }) {
  const [open,      setOpen]      = useState(false);
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);

  const openModal = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const res = await api.get('/images');
      setImages(res.data);
    } finally {
      setLoading(false);
    }
  };

  const upload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await api.post('/images/upload', form);
      setImages(prev => [res.data, ...prev]);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, []);

  const select = (url) => {
    onChange(url);
    setOpen(false);
  };

  return (
    <>
      <div>
        {label && <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>}
        <div className="flex items-center gap-3">
          {value ? (
            <img src={toPreviewUrl(value)} alt="" className="w-24 h-16 object-cover rounded-lg border border-slate-200 shrink-0" />
          ) : (
            <div className="w-24 h-16 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center shrink-0">
              <ImageIcon size={18} className="text-slate-300" />
            </div>
          )}
          <button
            type="button"
            onClick={openModal}
            className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            {value ? 'Cambia immagine' : 'Scegli immagine'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
              title="Rimuovi immagine"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-semibold text-slate-800">Libreria immagini</h2>
              <button onClick={() => setOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            {/* Upload strip */}
            <div className="px-5 py-3 border-b bg-slate-50">
              <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                uploading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}>
                <Upload size={14} />
                {uploading ? 'Caricamento…' : 'Carica nuova immagine'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={upload}
                  disabled={uploading}
                />
              </label>
              <span className="text-xs text-slate-400 ml-3">JPEG, PNG, WebP · max 8 MB</span>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <p className="text-sm text-slate-400 text-center py-8">Caricamento…</p>
              ) : images.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Nessuna immagine caricata</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map(img => (
                    <button
                      key={img.key}
                      type="button"
                      onClick={() => select(img.url)}
                      className="group text-left focus:outline-none"
                    >
                      <div className="aspect-video rounded-lg overflow-hidden border-2 border-transparent group-hover:border-amber-400 transition-colors">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-1 px-0.5">{img.key.replace('uploads/', '')}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
