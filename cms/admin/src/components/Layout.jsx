import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Toast from './Toast.jsx';

// Toast context — any page can call showToast()
import { createContext, useContext } from 'react';
const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export default function Layout() {
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => setToast({ message, type });

  return (
    <ToastCtx.Provider value={showToast}>
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastCtx.Provider>
  );
}
