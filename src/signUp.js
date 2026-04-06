
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { supabase } from "./supabaseClient";
import "./signUp.css";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const passwordRequirements =
    "Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo";

  function validatePassword(pw) {
    return (
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw)
    );
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!validatePassword(password)) {
      setError("La contraseña no cumple los requisitos.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!terms) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } }
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage("¡Registro exitoso! Revisa tu correo para confirmar.");
    }
  };

  return (
    <div className="center-page">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Crear cuenta</h2>
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre de empresa o usuario"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>
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
          <div className="requirements">{passwordRequirements}</div>
        </div>
        <div className="field" style={{ position: 'relative' }}>
          <label htmlFor="repeatPassword">Repetir contraseña</label>
          <input
            id="repeatPassword"
            type={showRepeatPassword ? "text" : "password"}
            placeholder="Repite la contraseña"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            required
            style={{ paddingRight: '2.5rem' }}
          />
          <span
            onClick={() => setShowRepeatPassword(v => !v)}
            style={{ position: 'absolute', right: '0.7rem', top: '2.35rem', cursor: 'pointer', color: '#888' }}
            tabIndex={0}
            aria-label={showRepeatPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="terms">
          <input
            id="terms"
            type="checkbox"
            checked={terms}
            onChange={e => setTerms(e.target.checked)}
          />
          <label htmlFor="terms">Acepto los <a href="#" target="_blank" rel="noopener noreferrer">términos y condiciones</a></label>
        </div>
        <button type="submit">Registrarse</button>
        {message && <div className="message">{message}</div>}
        {error && <div className="error">{error}</div>}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a href="/signIn" style={{ color: '#23272f', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }}>
            ¿Ya tienes cuenta? Inicia sesión aquí
          </a>
        </div>
      </form>
    </div>
  );
}