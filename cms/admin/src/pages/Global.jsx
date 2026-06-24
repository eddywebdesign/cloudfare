import { useState, useEffect } from 'react';
import api from '../api/client.js';
import PageShell from '../components/PageShell.jsx';

function Field({ label, value, onChange, type = 'text', hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-carp-brown mb-1.5">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-carp-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-carp-lt bg-carp-warm"
      />
      {hint && <p className="text-xs text-carp-muted mt-1">{hint}</p>}
    </div>
  );
}

export default function Global() {
  const [data, setData] = useState({ phone: '', phone_int: '', email: '' });

  useEffect(() => { api.get('/content/global').then(r => setData(r.data)); }, []);

  const set  = patch => setData(prev => ({ ...prev, ...patch }));
  const save = () => api.put('/content/global', data);

  return (
    <PageShell title="Impostazioni globali" subtitle="Telefono ed email — cambiano su tutte le pagine" onSave={save}>
      <div className="space-y-5 max-w-md">
        <Field
          label="Numero di telefono (visualizzato)"
          value={data.phone}
          onChange={v => set({ phone: v })}
          hint='Formato es. "+39 331 147 4808" — viene mostrato nei link cliccabili'
        />
        <Field
          label="Numero WhatsApp/tel (solo cifre con prefisso)"
          value={data.phone_int}
          onChange={v => set({ phone_int: v })}
          hint='Solo numeri, senza spazi né +. Es. "393311474808" — usato nei link href=tel: e WhatsApp'
        />
        <Field
          label="Email"
          value={data.email}
          type="email"
          onChange={v => set({ email: v })}
        />
      </div>
    </PageShell>
  );
}
