import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type, detail, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92vw] max-w-md">
      <div className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl border ${
        type === 'error'
          ? 'bg-red-50 text-red-800 border-red-200'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
      }`}>
        {type === 'error' ? <AlertCircle size={22} className="shrink-0 mt-0.5" /> : <CheckCircle size={22} className="shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold leading-snug">{message}</p>
          {detail && (
            <p className="text-xs opacity-70 mt-1 break-words">{detail}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-1 -m-1 rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Chiudi avviso"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
