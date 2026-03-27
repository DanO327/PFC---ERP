import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Pedidos() {
  const [userId, setUserId] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [idProveedor, setIdProveedor] = useState("");
  const [nombreProveedor, setNombreProveedor] = useState("");
  const [productosProveedor, setProductosProveedor] = useState([]);
  const [lineasPedido, setLineasPedido] = useState([]); // [{id_producto, nombre_producto, cantidad}]
  const [mensaje, setMensaje] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchProveedores = async () => {
      const { data, error } = await supabase
        .from('proveedores')
        .select('id, nombre_comercial')
        .eq('user_id', userId)
        .order('nombre_comercial', { ascending: true });
      if (!error) setProveedores(data);
    };
    fetchProveedores();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('id, descripcion, id_proveedor')
        .eq('user_id', userId);
      if (!error) setProductos(data);
    };
    fetchProductos();
  }, [userId]);

  // Filtrar productos del proveedor seleccionado
  useEffect(() => {
    if (!idProveedor) {
      setProductosProveedor([]);
      return;
    }
    setProductosProveedor(productos.filter(p => p.id_proveedor?.toString() === idProveedor.toString()));
  }, [idProveedor, productos]);

  const handleAddLinea = () => {
    setLineasPedido([...lineasPedido, { id_producto: "", nombre_producto: "", cantidad: 1 }]);
  };

  const handleLineaChange = (idx, field, value) => {
    const nuevasLineas = [...lineasPedido];
    if (field === "id_producto") {
      const prod = productosProveedor.find(p => p.id.toString() === value);
      nuevasLineas[idx].id_producto = value;
      nuevasLineas[idx].nombre_producto = prod ? prod.descripcion : "";
    } else {
      nuevasLineas[idx][field] = value;
    }
    setLineasPedido(nuevasLineas);
  };

  const handleRemoveLinea = (idx) => {
    setLineasPedido(lineasPedido.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (!userId || !idProveedor || lineasPedido.length === 0) {
      setMensaje("Completa todos los campos y añade al menos un producto");
      return;
    }
    setMensaje("Pedido guardado (simulado)");
    setIdProveedor("");
    setNombreProveedor("");
    setLineasPedido([]);
    setShowForm(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Pedidos</h2>
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
        title={showForm ? "Cancelar" : "Crear pedido"}
        aria-label={showForm ? "Cancelar" : "Crear pedido"}
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
              <h3 style={{marginTop:0}}>Nuevo pedido</h3>
              <select
                value={idProveedor}
                onChange={e => {
                  setIdProveedor(e.target.value);
                  const prov = proveedores.find(p => p.id.toString() === e.target.value);
                  setNombreProveedor(prov ? prov.nombre_comercial : "");
                  setLineasPedido([]); // reset productos al cambiar proveedor
                }}
                required
              >
                <option value="">Selecciona proveedor</option>
                {proveedores.map(p => (
                  <option key={p.id} value={p.id.toString()}>{p.nombre_comercial}</option>
                ))}
              </select>
              <div>
                <h4>Productos</h4>
                {lineasPedido.map((linea, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <select
                      value={linea.id_producto}
                      onChange={e => handleLineaChange(idx, "id_producto", e.target.value)}
                      required
                      style={{ minWidth: 180 }}
                    >
                      <option value="">Selecciona producto</option>
                      {productosProveedor.map(p => (
                        <option key={p.id} value={p.id.toString()}>{p.descripcion}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={linea.cantidad}
                      onChange={e => handleLineaChange(idx, "cantidad", e.target.value)}
                      style={{ width: 60 }}
                      required
                    />
                    <button type="button" onClick={() => handleRemoveLinea(idx)} style={{ color: '#f87171', border: 'none', background: 'none', fontSize: 20, cursor: 'pointer' }}>🗑️</button>
                  </div>
                ))}
                <button type="button" onClick={handleAddLinea} style={{ marginTop: 8, background: '#34d399', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Añadir producto</button>
              </div>
              <button type="submit">Guardar pedido</button>
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
      {/* mostrar la tabla de pedidos*/}
    </div>
  );
}
