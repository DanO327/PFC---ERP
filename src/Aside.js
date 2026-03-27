
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./Aside.css";

export default function Aside() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <aside className="aside-menu">
      <nav>
        <ul>
          <li><Link to="/inicio">Inicio</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/pedidos">Pedidos</Link></li>
          <li><Link to="/proveedores">Proveedores</Link></li>
          <li><Link to="/albaranes">Albaranes</Link></li>
          <li><Link to="/facturas">Facturas</Link></li>
        </ul>
      </nav>
      <button className="logout-btn" onClick={handleLogout} style={{marginTop: '2rem', width: '90%', marginLeft: '5%'}}>Cerrar sesión</button>
    </aside>
  );
}
