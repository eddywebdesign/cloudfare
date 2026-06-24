import { useState } from 'react';
import { Save, Globe, Loader2 } from 'lucide-react';
import api from '../api/client.js';
import { useToast } from './Layout.jsx';

// PageShell: header con titolo + pulsanti Salva / Pubblica.
// - onSave: () => Promise<void>   — salva la bozza in KV
// - children: il form della pagina
export default function PageShell({ title, subtitle, onSave, children }) {
  const showToast   = useToast();
  const [saving,    setSaving]    = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      showToast('Bozza salvata');
    } catch (e) {
      showToast(e.response?.data?.error ?? 'Errore nel salvataggio', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onSave();                        // always save first
      await api.post('/publish');
      showToast('Pubblicato! Il sito si aggiorna in ~30 secondi.');
    } catch (e) {
      showToast(e.response?.data?.error ?? 'Errore nella pubblicazione', 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex gap-2 shrink-0 ml-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || publishing}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Salva bozza
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving || publishing}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-carp-gold hover:bg-carp-brown text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
            Pubblica
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
