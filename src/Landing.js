import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="center-page">
      <div style={{ width: "min(600px, calc(100vw - 2rem))", margin: "0 auto", padding: "clamp(1.25rem, 4vw, 2rem)", background: "rgba(255,255,255,0.75)", borderRadius: 16, boxShadow: "0 4px 24px #0003", backdropFilter: "blur(6px)", boxSizing: "border-box" }}>
      <h1>Bienvenido a tu ERP Online</h1>
      <p>
        Esta aplicación te permite gestionar de forma sencilla y segura todos los aspectos clave de tu empresa:
      </p>
      <ul>
        <li>Gestión de Stock</li>
        <li>Contabilidad</li>
        <li>Pedidos</li>
        <li>Proveedores y Clientes</li>
        <li>Facturas</li>
      </ul>
      <p>
        Regístrate para crear tu empresa y empezar a organizar tu información de manera profesional, o inicia sesión si ya tienes una cuenta.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
        <Link to="/signUp" style={{ padding: "0.75rem 2rem", background: "#23272f", color: "#fff", borderRadius: 4, textDecoration: "none", flex: "1 1 220px", textAlign: "center", boxSizing: "border-box" }}>Registrarse</Link>
        <Link to="/signIn" style={{ padding: "0.75rem 2rem", background: "#61dafb", color: "#23272f", borderRadius: 4, textDecoration: "none", flex: "1 1 220px", textAlign: "center", boxSizing: "border-box" }}>Iniciar sesión</Link>
      </div>
      </div>
    </div>
  );
}
