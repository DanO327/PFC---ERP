import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ maxWidth: 600, margin: "4rem auto", padding: "2rem", background: "rgba(255,255,255,0.75)", borderRadius: 16, boxShadow: "0 4px 24px #0003", backdropFilter: "blur(6px)" }}>
      <h1>Bienvenido a tu ERP Online</h1>
      <p>
        Esta aplicación te permite gestionar de forma sencilla y segura todos los aspectos clave de tu empresa:
      </p>
      <ul>
        <li>Gestión de Stock</li>
        <li>Contabilidad</li>
        <li>Pedidos</li>
        <li>Proveedores y Clientes</li>
        <li>Albaranes y Facturas</li>
      </ul>
      <p>
        Regístrate para crear tu empresa y empezar a organizar tu información de manera profesional, o inicia sesión si ya tienes una cuenta.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
        <Link to="/signUp" style={{ padding: "0.75rem 2rem", background: "#23272f", color: "#fff", borderRadius: 4, textDecoration: "none" }}>Registrarse</Link>
        <Link to="/signIn" style={{ padding: "0.75rem 2rem", background: "#61dafb", color: "#23272f", borderRadius: 4, textDecoration: "none" }}>Iniciar sesión</Link>
      </div>
    </div>
  );
}
