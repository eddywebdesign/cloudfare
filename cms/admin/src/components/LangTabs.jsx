import { useState } from 'react';

const INPUT_CLS = 'w-full px-2.5 py-1.5 border border-carp-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-carp-lt bg-carp-warm';
const INPUT_ACCENT_CLS = 'w-full px-2.5 py-1.5 border border-carp-lt rounded-lg text-sm italic focus:outline-none focus:ring-2 focus:ring-carp-lt bg-carp-cream';

// Bilingual tab switcher — wraps any field that has IT and EN variants.
// Usage:
//   <BilingualInput label="Sottotitolo hero" value={data.subtitle} onChange={v => set({...data, subtitle: v})} />
//   <BilingualTextarea label="Testo prezzi" value={data.prices} onChange={v => set({...data, prices: v})} rows={4} />

function Tabs({ lang, onChange }) {
  return (
    <div className="flex gap-1 bg-carp-cream p-0.5 rounded-lg w-fit">
      {['it', 'en'].map(l => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            lang === l ? 'bg-white shadow-sm text-carp-brown' : 'text-carp-muted hover:text-carp-brown'
          }`}
        >
          {l === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'}
        </button>
      ))}
    </div>
  );
}

export function BilingualInput({ label, value = {}, onChange, placeholder }) {
  const [lang, setLang] = useState('it');
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <Tabs lang={lang} onChange={setLang} />
      </div>
      <input
        type="text"
        value={value[lang] ?? ''}
        onChange={e => onChange({ ...value, [lang]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-carp-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-carp-lt bg-carp-warm"
      />
    </div>
  );
}

// ── TitleParts: 3 plain-text inputs that build "before <em>accent</em> after"
// Used inside TitleField and BilingualTitle; value = { before, accent, after }
function TitleParts({ value = {}, onChange }) {
  const set = patch => onChange({ ...value, ...patch });
  const preview = [
    value.before?.trim(),
    value.accent?.trim() ? `[${value.accent.trim()}]` : '',
    value.after?.trim(),
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Prima</label>
          <input type="text" value={value.before ?? ''} onChange={e => set({ before: e.target.value })}
            placeholder="es. Le" className={INPUT_CLS} />
        </div>
        <div>
          <label className="text-xs text-carp-gold font-semibold mb-1 block">In corsivo</label>
          <input type="text" value={value.accent ?? ''} onChange={e => set({ accent: e.target.value })}
            placeholder="es. Carpanelle" className={INPUT_ACCENT_CLS} />
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Dopo</label>
          <input type="text" value={value.after ?? ''} onChange={e => set({ after: e.target.value })}
            placeholder="es. B&B" className={INPUT_CLS} />
        </div>
      </div>
      {preview && (
        <p className="text-xs text-slate-400">
          Anteprima: {value.before?.trim() && <span>{value.before.trim()} </span>}
          {value.accent?.trim() && <em className="text-carp-gold not-italic font-semibold">{value.accent.trim()}</em>}
          {value.after?.trim() && <span> {value.after.trim()}</span>}
        </p>
      )}
    </div>
  );
}

// Non-bilingual title (same in IT and EN)
export function TitleField({ label, value = {}, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <TitleParts value={value} onChange={onChange} />
    </div>
  );
}

// Bilingual title — tabs + TitleParts per language
export function BilingualTitle({ label, value = {}, onChange }) {
  const [lang, setLang] = useState('it');
  const current = value[lang] ?? {};
  const set = patch => onChange({ ...value, [lang]: { ...current, ...patch } });
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <Tabs lang={lang} onChange={setLang} />
      </div>
      <TitleParts value={current} onChange={set} />
    </div>
  );
}

export function BilingualTextarea({ label, value = {}, onChange, rows = 3, placeholder }) {
  const [lang, setLang] = useState('it');
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <Tabs lang={lang} onChange={setLang} />
      </div>
      <textarea
        rows={rows}
        value={value[lang] ?? ''}
        onChange={e => onChange({ ...value, [lang]: e.target.value })}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-carp-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-carp-lt resize-y bg-carp-warm"
      />
    </div>
  );
}
