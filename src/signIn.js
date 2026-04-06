import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./signUp.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setMessage("¡Login exitoso!");
      setTimeout(() => {
        navigate("/inicio");
      }, 500);
    }
  };

  return (
    <div className="center-page">
      <form className="register-form" onSubmit={handleLogin}>
        <h2>Iniciar sesión</h2>
        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field" style={{ position: 'relative' }}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ paddingRight: '2.5rem' }}
          />
          <span
            onClick={() => setShowPassword(v => !v)}
            style={{ position: 'absolute', right: '0.7rem', top: '2.35rem', cursor: 'pointer', color: '#888' }}
            tabIndex={0}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button type="submit">Iniciar sesión</button>
        {message && <div className="message">{message}</div>}
        {error && <div className="error">{error}</div>}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/signUp" style={{ color: '#23272f', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }}>
            ¿Aún no tienes cuenta? Regístrate aquí
          </a>
        </div>
      </form>
    </div>
  );
}
