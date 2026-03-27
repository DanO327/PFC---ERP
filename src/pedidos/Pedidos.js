import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Pedidos() {
  const [userId, setUserId] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [idProveedor, setIdProveedor] = useState("");
  // ...existing code...

  // Calcular el total de los precios de coste de los productos añadidos
  const calcularTotalCoste = () => {
    console.log('productosProveedor:', productosProveedor);
    console.log('lineasPedido:', lineasPedido);
    let total = 0;
    for (const linea of lineasPedido) {
      const producto = productosProveedor.find(p => p.id.toString() === linea.id_producto);
      const precio = producto && producto.precio_coste ? parseFloat(producto.precio_coste) : 0;
      const cantidad = linea.cantidad ? parseFloat(linea.cantidad) : 1;
      total += precio * cantidad;
    }
    return total;
  };
  const [nombreProveedor, setNombreProveedor] = useState("");
  const [productosProveedor, setProductosProveedor] = useState([]);
  const [lineasPedido, setLineasPedido] = useState([]); // [{id_producto, nombre_producto, cantidad}]
  const [mensaje, setMensaje] = useState("");
  const [showForm, setShowForm] = useState(false);
  // Modales para crear proveedor/producto
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  // Campos para proveedor
  const [nuevoProveedor, setNuevoProveedor] = useState("");
  const [nuevoRazonSocial, setNuevoRazonSocial] = useState("");
  const [nuevoEmailProveedor, setNuevoEmailProveedor] = useState("");
  const [showProductoModal, setShowProductoModal] = useState({ show: false, idx: null });
  // Campos para producto
  const [nuevoProducto, setNuevoProducto] = useState("");
  const [nuevoPrecioCoste, setNuevoPrecioCoste] = useState("");
  const [nuevoPvp, setNuevoPvp] = useState("");
  
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
        .select('id, descripcion, id_proveedor, precio_coste, pvp')
        .eq('user_id', userId);
      console.log('fetchProductos data:', data);
      if (!error) setProductos(data);
    };
    fetchProductos();
  }, [userId]);

  // Filtrar productos del proveedor seleccionado
  useEffect(() => {
    if (!idProveedor) {
      setProductosProveedor(productos); // Mostrar todos los productos si no hay proveedor seleccionado
      return;
    }
    setProductosProveedor(productos.filter(p => String(p.id_proveedor) === String(idProveedor)));
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

    // Calcular el total del pedido
    let totalPedido = 0;
    const lineas = lineasPedido.map(linea => {
      const producto = productosProveedor.find(p => p.id.toString() === linea.id_producto);
      const precio = producto && producto.precio_coste ? parseFloat(producto.precio_coste) : 0;
      const cantidad = linea.cantidad ? parseFloat(linea.cantidad) : 1;
      const total_linea = precio * cantidad;
      totalPedido += total_linea;
      return {
        id_producto: linea.id_producto,
        cantidad,
        precio_unitario: precio,
        total_linea
      };
    });

    // 1. Insertar pedido
    const { data: pedidoData, error: pedidoError } = await supabase
      .from('pedidos')
      .insert([
        {
          id_proveedor: idProveedor,
          user_id: userId,
          total: totalPedido
        }
      ])
      .select();

    if (pedidoError || !pedidoData || !pedidoData[0]) {
      setMensaje("Error al guardar el pedido");
      return;
    }

    const pedidoId = pedidoData[0].id;

    // 2. Insertar líneas de pedido
    const lineasConPedido = lineas.map(l => ({ ...l, id_pedido: pedidoId }));
    const { error: lineasError } = await supabase
      .from('lineas_pedido')
      .insert(lineasConPedido);

    if (lineasError) {
      setMensaje("Pedido guardado pero error al guardar líneas");
      return;
    }

    setMensaje("Pedido guardado correctamente");
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                <button type="button" onClick={() => setShowProveedorModal(true)} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>Nuevo proveedor</button>
              </div>
              <div>
                <h4>Productos</h4>
                {lineasPedido.length > 0 && (
                  <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                    Total: {calcularTotalCoste().toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </div>
                )}
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
                    <button type="button" onClick={() => setShowProductoModal({ show: true, idx })} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>Nuevo producto</button>
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
            {/* Modal para crear proveedor */}
            {showProveedorModal && (
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
                zIndex: 2000
              }}>
                <div style={{ background: 'white', borderRadius: 8, padding: 24, minWidth: 240, maxWidth: 320, position: 'relative' }}>
                  <h4>Nuevo proveedor</h4>
                  <input
                    type="text"
                    placeholder="Razón social"
                    value={nuevoRazonSocial}
                    onChange={e => setNuevoRazonSocial(e.target.value)}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                  <input
                    type="text"
                    placeholder="Nombre comercial"
                    value={nuevoProveedor}
                    onChange={e => setNuevoProveedor(e.target.value)}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={nuevoEmailProveedor}
                    onChange={e => setNuevoEmailProveedor(e.target.value)}
                    style={{ width: '100%', marginBottom: 12 }}
                  />
                  <button
                    onClick={async () => {
                      if (!nuevoProveedor.trim() || !nuevoRazonSocial.trim()) return;
                      const { data, error } = await supabase.from('proveedores').insert([
                        {
                          razon_social: nuevoRazonSocial,
                          nombre_comercial: nuevoProveedor,
                          email: nuevoEmailProveedor || null,
                          user_id: userId
                        }
                      ]).select();
                      if (!error && data && data[0]) {
                        setProveedores(prev => [...prev, data[0]]);
                        setIdProveedor(data[0].id.toString());
                        setNombreProveedor(data[0].nombre_comercial);
                        setShowProveedorModal(false);
                        setNuevoProveedor("");
                        setNuevoRazonSocial("");
                        setNuevoEmailProveedor("");
                      }
                    }}
                    style={{ background: '#34d399', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 8 }}
                  >Crear</button>
                  <button onClick={() => {
                    setShowProveedorModal(false);
                    setNuevoProveedor("");
                    setNuevoRazonSocial("");
                    setNuevoEmailProveedor("");
                  }} style={{ background: '#f87171', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px' }}>Cancelar</button>
                </div>
              </div>
            )}
            {showProductoModal.show && (
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
                zIndex: 2000
              }}>
                <div style={{ background: 'white', borderRadius: 8, padding: 24, minWidth: 240, maxWidth: 320, position: 'relative' }}>
                  <h4>Nuevo producto</h4>
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={nuevoProducto}
                    onChange={e => setNuevoProducto(e.target.value)}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                  <input
                    type="number"
                    placeholder="Precio de coste"
                    value={nuevoPrecioCoste}
                    onChange={e => setNuevoPrecioCoste(e.target.value)}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                  <input
                    type="number"
                    placeholder="PVP"
                    value={nuevoPvp}
                    onChange={e => setNuevoPvp(e.target.value)}
                    style={{ width: '100%', marginBottom: 12 }}
                  />
                  <button
                    onClick={async () => {
                      if (!nuevoProducto.trim() || !idProveedor) return;
                      const { data, error } = await supabase.from('productos').insert([
                        {
                          descripcion: nuevoProducto,
                          precio_coste: nuevoPrecioCoste === "" ? null : parseFloat(nuevoPrecioCoste),
                          pvp: nuevoPvp === "" ? null : parseFloat(nuevoPvp),
                          id_proveedor: idProveedor,
                          user_id: userId
                        }
                      ]).select();
                      if (!error && data && data[0]) {
                        setProductos(prev => [...prev, data[0]]);
                        setProductosProveedor(prev => [...prev, data[0]]);
                        // Asignar el producto recién creado a la línea correspondiente
                        setLineasPedido(prev => prev.map((l, i) => i === showProductoModal.idx ? { ...l, id_producto: data[0].id.toString(), nombre_producto: data[0].descripcion } : l));
                        setShowProductoModal({ show: false, idx: null });
                        setNuevoProducto("");
                        setNuevoPrecioCoste("");
                        setNuevoPvp("");
                      }
                    }}
                    style={{ background: '#34d399', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px', marginRight: 8 }}
                  >Crear</button>
                  <button onClick={() => {
                    setShowProductoModal({ show: false, idx: null });
                    setNuevoProducto("");
                    setNuevoPrecioCoste("");
                    setNuevoPvp("");
                  }} style={{ background: '#f87171', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px' }}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {mensaje && <p>{mensaje}</p>}

    </div>
  );
}
