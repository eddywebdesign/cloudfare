import { useState } from 'react';

// Bilingual tab switcher — wraps any field that has IT and EN variants.
// Usage:
//   <BilingualInput label="Sottotitolo hero" value={data.subtitle} onChange={v => set({...data, subtitle: v})} />
//   <BilingualTextarea label="Testo prezzi" value={data.prices} onChange={v => set({...data, prices: v})} rows={4} />

function Tabs({ lang, onChange }) {
  return (
    <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg w-fit">
      {['it', 'en'].map(l => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            lang === l ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'
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
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
      />
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
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y bg-white"
      />
    </div>
  );
}
