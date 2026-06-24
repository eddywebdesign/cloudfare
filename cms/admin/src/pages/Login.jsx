import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Leaf, AlertCircle } from 'lucide-react';

export default function Login() {
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error ?? 'Credenziali non valide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-carp-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-carp-gold rounded-2xl mb-4">
            <Leaf size={26} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold">Le Carpanelle</h1>
          <p className="text-white/50 text-sm mt-1">Pannello di amministrazione</p>
        </div>

        <form onSubmit={submit} className="bg-carp-brown/60 rounded-2xl p-6 space-y-4 border border-white/10">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-carp-lt focus:border-transparent"
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full px-3 py-2.5 bg-white/10 border border-white/15 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-carp-lt focus:border-transparent"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-carp-gold hover:bg-carp-brown text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Accesso in corso…' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
