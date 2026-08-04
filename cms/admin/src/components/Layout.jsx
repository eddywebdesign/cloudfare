import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import Toast from './Toast.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

const IDLE_MS = 30 * 60 * 1000; // 30 minutes

export default function Layout() {
  const [toast, setToast]       = useState(null);
  const [idleWarn, setIdleWarn] = useState(false); // 1-minute warning before logout
  const showToast = (message, type = 'success', detail) => setToast({ message, type, detail });

  const { logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const timer      = useRef(null);
  const warnTimer  = useRef(null);
  const mainRef    = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const doLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const resetTimer = useCallback(() => {
    setIdleWarn(false);
    clearTimeout(timer.current);
    clearTimeout(warnTimer.current);
    // Show warning 1 minute before logout
    warnTimer.current = setTimeout(() => setIdleWarn(true), IDLE_MS - 60_000);
    timer.current     = setTimeout(doLogout, IDLE_MS);
  }, [doLogout]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timer.current);
      clearTimeout(warnTimer.current);
    };
  }, [resetTimer]);

  // Pulsante "torna su" — utile soprattutto nella Galleria con molte foto.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Riparti dall'alto ad ogni cambio pagina.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    setShowScrollTop(false);
  }, [location.pathname]);

  const scrollToTop = () => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <ToastCtx.Provider value={showToast}>
      <div className="flex h-screen bg-carp-cream">
        <Sidebar />
        <main ref={mainRef} className="flex-1 overflow-y-auto relative">
          <Outlet />

          {showScrollTop && (
            <button
              type="button"
              onClick={scrollToTop}
              title="Torna all'inizio della pagina"
              className="fixed bottom-6 right-6 z-40 p-3 bg-carp-gold hover:bg-carp-brown text-white rounded-full shadow-lg transition-colors"
            >
              <ArrowUp size={18} />
            </button>
          )}
        </main>
      </div>

      {/* Idle-logout warning banner */}
      {idleWarn && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-carp-gold text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg">
          <span>Sessione in scadenza tra 1 minuto per inattività</span>
          <button
            onClick={resetTimer}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-xs transition-colors"
          >
            Continua
          </button>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          detail={toast.detail}
          onClose={() => setToast(null)}
        />
      )}
    </ToastCtx.Provider>
  );
}
