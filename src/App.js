import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Aside from "./Aside";
import "./Aside.css";
import "./Header.css";
import Register from "./signUp";
import Login from "./signIn";
import Landing from "./Landing";
import Inicio from "./inicio/Inicio";

import Productos from "./productos/Productos";
import Proveedores from "./proveedores/Proveedores";
import Pedidos from "./pedidos/Pedidos";
import Header from "./Header";
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

function AppContent() {
  const location = useLocation();
  const hideAside = ["/", "/signUp", "/signIn"].includes(location.pathname);
  const hideHeader = ["/", "/signUp", "/signIn"].includes(location.pathname);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession ? supabase.auth.getSession() : supabase.auth.session();
    if (session && session.user) {
      setUser(session.user);
    } else {
      // Para nuevas versiones de supabase-js
      supabase.auth.getUser && supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setUser(data.user);
      });
    }
    // Listener para cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange?.((event, session) => {
      setUser(session?.user || null);
    }) || {};
    return () => {
      if (listener && listener.subscription) listener.subscription.unsubscribe();
    };
  }, []);

  const gradientBg = {
    background: "linear-gradient(120deg, #6366f1 0%, #38bdf8 50%, #f472b6 100%)"
  };

  return (
    <div className={`app-layout${hideAside ? " full" : ""}${hideHeader ? " auth-bg" : ""}`}
         style={hideHeader ? gradientBg : {}}>
      {!hideHeader && <Header user={user} />}
      {!hideAside && <Aside />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contabilidad" element={<div>Contabilidad</div>} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/albaranes" element={<div>Albaranes</div>} />
          <Route path="/facturas" element={<div>Facturas</div>} />
          <Route path="/signUp" element={<Register />} />
          <Route path="/signIn" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;