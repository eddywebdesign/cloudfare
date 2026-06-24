import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login        from './pages/Login.jsx';
import Dashboard    from './pages/Dashboard.jsx';
import PageHome     from './pages/PageHome.jsx';
import PageBB       from './pages/PageBB.jsx';
import PageContatti from './pages/PageContatti.jsx';
import PageGallery  from './pages/PageGallery.jsx';
import Global       from './pages/Global.jsx';
import Images       from './pages/Images.jsx';

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-400">Caricamento…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/cms">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Guard><Layout /></Guard>}>
            <Route index         element={<Dashboard />} />
            <Route path="home"     element={<PageHome />} />
            <Route path="bb"       element={<PageBB />} />
            <Route path="contatti" element={<PageContatti />} />
            <Route path="gallery"  element={<PageGallery />} />
            <Route path="images"   element={<Images />} />
            <Route path="global"   element={<Global />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
