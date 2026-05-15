
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
          <li><Link to="/inicio"><span>Inicio</span></Link></li>
          <li><Link to="/productos"><span>Productos</span></Link></li>
          <li><Link to="/pedidos"><span>Pedidos</span></Link></li>
          <li><Link to="/proveedores"><span>Proveedores</span></Link></li>
          <li><Link to="/facturas"><span>Facturas</span></Link></li>
        </ul>
      </nav>
      <div className="aside-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.7em'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle'}}>
              <path d="M12 2v10" />
              <path d="M17.657 6.343a8 8 0 1 1-11.314 0" />
            </svg>
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
}
