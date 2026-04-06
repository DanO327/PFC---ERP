import React, { useState, useRef, useEffect } from "react";
import "./Header.css";

function getInitials(email) {
  if (!email) return "?";
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Header({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="profile-section" ref={ref}>
          <div
            className="avatar avatar-initials"
            onClick={() => setOpen((v) => !v)}
            style={{ cursor: "pointer" }}
            title={user?.email || "Mi Perfil"}
          >
            {getInitials(user?.email)}
          </div>
          {open && (
            <div className="dropdown-menu">
              <div className="dropdown-item">{user?.email || "Mi Perfil"}</div>
              <div className="dropdown-divider" />
              <div className="dropdown-item logout">Cerrar sesión</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
