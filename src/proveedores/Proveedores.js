import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// Material icons guardados, ahora probamos Feather
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const Proveedores = () => {
  const [razonSocial, setRazonSocial] = useState('');
  const [nombreComercial, setNombreComercial] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState(null);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchProveedores = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('proveedores')
        .select('id, razon_social, nombre_comercial, email, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error) setProveedores(data);
    };
    if (userId) fetchProveedores();
  }, [userId, mensaje]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (!userId) {
      setMensaje('No se ha detectado usuario');
      return;
    }
    if (editId) {
      //actualizar proveedor existente
      const { error } = await supabase
        .from('proveedores')
        .update({
          razon_social: razonSocial,
          nombre_comercial: nombreComercial,
          email: email || null
        })
        .eq('id', editId)
        .eq('user_id', userId);
      if (error) {
        setMensaje('Error al actualizar proveedor');
      } else {
        setMensaje('Proveedor actualizado correctamente');
        setEditId(null);
        setShowForm(false);
        setRazonSocial('');
        setNombreComercial('');
        setEmail('');
      }
    } else {
      //insertar nuevo proveedor
      const { error } = await supabase.from('proveedores').insert([
        {
          razon_social: razonSocial,
          nombre_comercial: nombreComercial,
          email: email || null,
          user_id: userId
        }
      ]);
      if (error) {
        setMensaje('Error al crear proveedor');
      } else {
        setMensaje('Proveedor creado correctamente');
        setRazonSocial('');
        setNombreComercial('');
        setEmail('');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este proveedor?')) return;
    const { error } = await supabase.from('proveedores').delete().eq('id', id).eq('user_id', userId);
    if (error) {
      setMensaje('Error al borrar proveedor');
    } else {
      setMensaje('Proveedor borrado correctamente');
    }
  };

  const handleEdit = (prov) => {
    setEditId(prov.id);
    setRazonSocial(prov.razon_social);
    setNombreComercial(prov.nombre_comercial);
    setEmail(prov.email || '');
    setShowForm(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Proveedores</h2>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          marginBottom: "1rem",
          width: 40,
          height: 40,
          borderRadius: "50%",
          fontSize: 24,
          background: showForm ? "#f87171" : "#34d399",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
        title={showForm ? "Cancelar" : "Crear proveedor"}
        aria-label={showForm ? "Cancelar" : "Crear proveedor"}
      >
        {showForm ? "✕" : "+"}
      </button>
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
            padding: 32,
            minWidth: 320,
            maxWidth: '90vw',
            position: 'relative'
          }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{marginTop:0}}>{editId ? 'Editar proveedor' : 'Crear proveedor'}</h3>
              <input
                type="text"
                placeholder="Razón social"
                value={razonSocial}
                onChange={e => setRazonSocial(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Nombre comercial"
                value={nombreComercial}
                onChange={e => setNombreComercial(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email (opcional)"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button type="submit">Guardar</button>
            </form>
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'transparent',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer',
                color: '#888'
              }}
              aria-label="Cerrar modal"
              title="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {mensaje && <p>{mensaje}</p>}

      <h3 style={{marginTop: '2rem'}}>Mis proveedores</h3>
      {proveedores.length === 0 ? (
        <p>No hay proveedores registrados.</p>
      ) : (
        <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem', minWidth: 700}}>
          <thead>
            <tr>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'left'}}>Razón social</th>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'left'}}>Nombre comercial</th>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'left'}}>Email</th>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'right'}}>Fecha</th>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'center'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map(prov => (
              <tr key={prov.id}>
                <td style={{
                  maxWidth: 180,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} title={prov.razon_social}>{prov.razon_social}</td>
                <td style={{
                  maxWidth: 160,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} title={prov.nombre_comercial}>{prov.nombre_comercial}</td>
                <td style={{
                  maxWidth: 180,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} title={prov.email}>{prov.email}</td>
                <td style={{textAlign: 'right'}}>{prov.created_at ? new Date(prov.created_at).toLocaleString() : ''}</td>
                <td style={{textAlign: 'center'}}>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}
                    title="Editar proveedor"
                    aria-label="Editar proveedor"
                    onClick={() => handleEdit(prov)}
                  >
                    <FiEdit size={22} color="#2563eb" />
                  </button>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}
                    title="Borrar proveedor"
                    aria-label="Borrar proveedor"
                    onClick={() => handleDelete(prov.id)}
                  >
                    <FiTrash2 size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default Proveedores;
