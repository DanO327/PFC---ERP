

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function Productos() {
  // Declarar todos los useState primero
  const [proveedores, setProveedores] = useState([]);
  const [idProveedor, setIdProveedor] = useState("");
  const [nombreProveedor, setNombreProveedor] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [precioCoste, setPrecioCoste] = useState("");
  const [pvp, setPvp] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [productos, setProductos] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editId, setEditId] = useState(null);

  // Todos los useEffect después
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
        .select('id, nombre_comercial')
        .eq('user_id', userId)
        .order('nombre_comercial', { ascending: true });
      if (!error) setProveedores(data);
    };
    if (userId) fetchProveedores();
  }, [userId]);

  const fetchProductos = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("productos")
      .select("id, descripcion, precio_coste, pvp, created_at, id_proveedor, nombre_proveedor")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error) setProductos(data);
  };

  useEffect(() => {
    if (userId) fetchProductos();
  }, [userId, mensaje]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (!userId) {
      setMensaje("No se ha detectado usuario");
      return;
    }
    if (!idProveedor) {
      setMensaje("Selecciona un proveedor");
      return;
    }
    if (editId) {
      // Editar producto existente
      const { error } = await supabase
        .from("productos")
        .update({
          descripcion,
          precio_coste: precioCoste === "" ? null : parseFloat(precioCoste),
          pvp: pvp === "" ? null : parseFloat(pvp),
          id_proveedor: idProveedor || null,
          nombre_proveedor: nombreProveedor || null
        })
        .eq("id", editId)
        .eq("user_id", userId);
      if (error) {
        setMensaje("Error al actualizar producto");
      } else {
        setMensaje("Producto actualizado correctamente");
        setEditId(null);
        setShowForm(false);
        setDescripcion("");
        setPrecioCoste("");
        setPvp("");
        setIdProveedor("");
        setNombreProveedor("");
      }
    } else {
      // Crear producto nuevo
      const { error } = await supabase.from("productos").insert([
        {
          descripcion,
          precio_coste: precioCoste === "" ? null : parseFloat(precioCoste),
          pvp: pvp === "" ? null : parseFloat(pvp),
          user_id: userId,
          id_proveedor: idProveedor || null,
          nombre_proveedor: nombreProveedor || null
        }
      ]);
      if (error) {
        setMensaje("Error al crear producto");
      } else {
        setMensaje("Producto creado correctamente");
        setDescripcion("");
        setPrecioCoste("");
        setPvp("");
        setIdProveedor("");
        setNombreProveedor("");
        setShowForm(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este producto?')) return;
    const { error } = await supabase.from('productos').delete().eq('id', id).eq('user_id', userId);
    if (error) {
      setMensaje('Error al borrar producto');
    } else {
      setMensaje('Producto borrado correctamente');
    }
  };

  const handleEdit = (prod) => {
    setEditId(prod.id);
    setDescripcion(prod.descripcion);
    setPrecioCoste(prod.precio_coste?.toString() || "");
    setPvp(prod.pvp?.toString() || "");
    setIdProveedor(prod.id_proveedor || "");
    setNombreProveedor(prod.nombre_proveedor || "");
    setShowForm(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Productos</h2>
      <button
        onClick={() => {
          setShowForm(!showForm);
          if (!showForm) {
            setEditId(null);
            setDescripcion("");
            setPrecioCoste("");
            setPvp("");
          }
        }}
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
        title={showForm ? "Cancelar" : "Crear producto"}
        aria-label={showForm ? "Cancelar" : "Crear producto"}
      >
        {showForm ? "✕" : "+"}
      </button>
      {showForm && (
        <div className="app-modal-overlay" style={{ zIndex: 1000 }}>
          <div className="app-modal-card">
            <form className="app-modal-form" onSubmit={handleSubmit}>
              <h3 style={{marginTop:0}}>{editId ? 'Editar producto' : 'Crear producto'}</h3>
              <input
                type="text"
                placeholder="Descripción"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                required
              />
              <select
                value={idProveedor?.toString()}
                onChange={e => {
                  setIdProveedor(e.target.value);
                  const prov = proveedores.find(p => p.id.toString() === e.target.value);
                  setNombreProveedor(prov ? prov.nombre_comercial : "");
                }}
                required
              >
                <option value="">Selecciona proveedor</option>
                {/* Si el proveedor actual no está en la lista, mostrarlo como opción especial */}
                {idProveedor && !proveedores.some(p => p.id.toString() === idProveedor.toString()) && (
                  <option value={idProveedor} style={{color:'#f87171'}}>
                    Proveedor no disponible
                  </option>
                )}
                {proveedores.map(p => (
                  <option key={p.id} value={p.id.toString()}>{p.nombre_comercial}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Precio de coste"
                value={precioCoste}
                onChange={e => setPrecioCoste(e.target.value)}
                step="0.01"
                min="0"
                required
              />
              <input
                type="number"
                placeholder="PVP"
                value={pvp}
                onChange={e => setPvp(e.target.value)}
                step="0.01"
                min="0"
                required
              />
              <button type="submit">Guardar</button>
            </form>
            <button
              className="app-modal-close"
              onClick={() => setShowForm(false)}
              aria-label="Cerrar modal"
              title="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {mensaje && <p>{mensaje}</p>}
      <h3 style={{marginTop: '2rem'}}>Listado de productos</h3>
      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem', minWidth: 700}}>
          <thead>
            <tr>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'left'}}>Descripción</th>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'left'}}>Proveedor</th>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'right'}}>Precio coste</th>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'right'}}>PVP</th>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'right'}}>Fecha</th>
              <th style={{borderBottom: '1px solid #ccc', textAlign: 'center'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.id}>
                <td style={{
                  maxWidth: 180,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} title={prod.descripcion}>{prod.descripcion}</td>
                <td style={{
                  maxWidth: 160,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }} title={prod.nombre_proveedor}>{prod.nombre_proveedor}</td>
                <td style={{textAlign: 'right'}}>{prod.precio_coste?.toFixed(2)}</td>
                <td style={{textAlign: 'right'}}>{prod.pvp?.toFixed(2)}</td>
                <td style={{textAlign: 'right'}}>{prod.created_at ? new Date(prod.created_at).toLocaleString() : ''}</td>
                <td style={{textAlign: 'center'}}>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8 }}
                    title="Editar producto"
                    aria-label="Editar producto"
                    onClick={() => handleEdit(prod)}
                  >
                    <FiEdit size={22} color="#2563eb" />
                  </button>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}
                    title="Borrar producto"
                    aria-label="Borrar producto"
                    onClick={() => handleDelete(prod.id)}
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
}
