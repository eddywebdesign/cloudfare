import { useState, useEffect, useRef } from 'react';
import { Save, Globe, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import api from '../api/client.js';
import { useToast } from './Layout.jsx';

const SITE_URL = 'https://www.lecarpanelle.it/';

// Messaggio d'errore in italiano semplice per chi non lavora con l'informatica.
// Il dettaglio tecnico (se presente) resta visibile ma in piccolo, per il supporto.
function friendlyError(e, fallback) {
  const detail = e.response?.data?.error;
  return { headline: fallback, detail };
}

// PageShell: header con titolo + link "Vedi sul sito" + pulsanti Salva / Pubblica.
// - onSave: () => Promise<void>   — salva la bozza in KV
// - publicPath: hash della pagina corrispondente sul sito pubblico (es. "#Gallery").
//   Omesso per pagine senza corrispondenza diretta (es. Impostazioni globali).
// - children: il form della pagina
export default function PageShell({ title, subtitle, onSave, publicPath, children }) {
  const showToast    = useToast();
  const [saving,     setSaving]     = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [dirty,      setDirty]      = useState(false);
  const contentRef   = useRef(null);

  // Rileva automaticamente le modifiche non salvate: qualsiasi interazione
  // dell'utente dentro il form (click, digitazione, selezione immagine) la
  // segna come "non salvata" finché non si preme Salva bozza o Pubblica.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const markDirty = () => setDirty(true);
    el.addEventListener('input', markDirty);
    el.addEventListener('click', markDirty);
    return () => {
      el.removeEventListener('input', markDirty);
      el.removeEventListener('click', markDirty);
    };
  }, []);

  // Avvisa prima di chiudere/ricaricare la scheda se ci sono modifiche non salvate.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      setDirty(false);
      showToast('✓ Bozza salvata correttamente.');
    } catch (e) {
      const { headline, detail } = friendlyError(e, 'Non è stato possibile salvare. Controlla la connessione e riprova.');
      showToast(headline, 'error', detail);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onSave();                        // always save first
      await api.post('/publish');
      setDirty(false);
      showToast('✓ Pubblicato! Il sito si aggiornerà tra circa 30 secondi.');
    } catch (e) {
      const { headline, detail } = friendlyError(e, 'La pubblicazione non è andata a buon fine. Riprova tra poco.');
      showToast(headline, 'error', detail);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
          {publicPath !== undefined && (
            <a
              href={`${SITE_URL}${publicPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-carp-gold hover:text-carp-brown mt-1.5 transition-colors"
            >
              <ExternalLink size={12} />
              Vedi questa pagina sul sito
            </a>
          )}
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

      {/* Promemoria modifiche non salvate */}
      {dirty && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg">
          <AlertTriangle size={15} className="shrink-0" />
          Hai modifiche non salvate. Premi <strong>Salva bozza</strong> per conservarle o <strong>Pubblica</strong> per metterle online.
        </div>
      )}

      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
