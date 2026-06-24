import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, Bed, Phone, GalleryHorizontal, Image, Settings, LogOut, Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';

const navItems = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard',   end: true },
  { to: '/home',     icon: Home,            label: 'Homepage' },
  { to: '/bb',       icon: Bed,             label: 'Claudia B&B' },
  { to: '/contatti', icon: Phone,           label: 'Contatti' },
  { to: '/gallery',  icon: GalleryHorizontal, label: 'Galleria' },
  { to: '/images',   icon: Image,           label: 'Immagini' },
  { to: '/global',   icon: Settings,        label: 'Impostazioni' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-56 bg-slate-900 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center">
            <Leaf size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Le Carpanelle</p>
            <p className="text-slate-400 text-xs mt-0.5">CMS Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-700/60">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-7 h-7 bg-amber-600/20 rounded-full flex items-center justify-center text-xs text-amber-400 font-semibold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span className="text-slate-300 text-sm truncate">{user?.username}</span>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={14} />
          Esci
        </button>
      </div>
    </aside>
  );
}
