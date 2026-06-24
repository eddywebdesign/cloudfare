import { Link } from 'react-router-dom';
import { Home, Bed, Phone, GalleryHorizontal, Settings, ExternalLink } from 'lucide-react';

const sections = [
  { to: '/home',     icon: Home,   label: 'Homepage',    desc: 'Slider, testo hero, recensioni' },
  { to: '/bb',       icon: Bed,    label: 'Claudia B&B', desc: 'Hero, prezzi, massaggio, gallery' },
  { to: '/contatti', icon: Phone,  label: 'Contatti',    desc: 'Hero e testo della pagina' },
  { to: '/gallery',  icon: GalleryHorizontal, label: 'Galleria', desc: 'Hero e griglia foto (aggiungi/rimuovi)' },
  { to: '/global',   icon: Settings,label: 'Impostazioni', desc: 'Telefono ed email globali' },
];

export default function Dashboard() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Scegli la sezione da modificare</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {sections.map(({ to, icon: Icon, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <Icon size={17} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <a
        href="https://www.lecarpanelle.it"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
      >
        <ExternalLink size={14} />
        Apri il sito
      </a>
    </div>
  );
}
