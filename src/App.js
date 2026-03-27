import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Aside from "./Aside";
import "./Aside.css";
import Register from "./signUp";
import Login from "./signIn";
import Landing from "./Landing";
import Inicio from "./inicio/Inicio";

import Productos from "./productos/Productos";
import Proveedores from "./proveedores/Proveedores";
import Pedidos from "./pedidos/Pedidos";

function AppContent() {
  const location = useLocation();
  const hideAside = ["/", "/signUp", "/signIn"].includes(location.pathname);
  const isAuthPage = ["/signUp", "/signIn"].includes(location.pathname);

  const gradientBg = {
    minHeight: "100vh",
    background: "linear-gradient(120deg, #6366f1 0%, #38bdf8 50%, #f472b6 100%)",
    paddingTop: "4rem",
    paddingBottom: "4rem"
  };

  return (
    <div className={`app-layout${hideAside ? " full" : ""}${isAuthPage ? " auth-bg" : ""}`}
         style={isAuthPage ? gradientBg : {}}>
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