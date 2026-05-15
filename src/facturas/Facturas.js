import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { supabase } from "../supabaseClient";

export default function Facturas() {
  const [userId, setUserId] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [idProveedor, setIdProveedor] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [total, setTotal] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [mensaje, setMensaje] = useState("");
  const [cargandoFacturas, setCargandoFacturas] = useState(false);

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
        .from("proveedores")
        .select("id, nombre_comercial")
        .eq("user_id", userId)
        .order("nombre_comercial", { ascending: true });

      if (!error && data) {
        setProveedores(data);
      }
    };

    fetchProveedores();
  }, [userId]);

  useEffect(() => {
    const fetchFacturas = async () => {
      if (!userId) return;

      setCargandoFacturas(true);

      const { data, error } = await supabase
        .from("facturas")
        .select("id, user_id, id_proveedor, numero_factura, fecha_emision, fecha_vencimiento, total, estado, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setMensaje("Error al cargar facturas");
        setCargandoFacturas(false);
        return;
      }

      setFacturas(data || []);
      setCargandoFacturas(false);
    };

    fetchFacturas();
  }, [userId, mensaje]);

  const resetForm = () => {
    setEditId(null);
    setIdProveedor("");
    setNumeroFactura("");
    setFechaEmision("");
    setFechaVencimiento("");
    setTotal("");
    setEstado("pendiente");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMensaje("");

    if (!userId) {
      setMensaje("No se ha detectado usuario");
      return;
    }

    if (!idProveedor || !numeroFactura || !fechaEmision || total === "") {
      setMensaje("Completa los campos obligatorios");
      return;
    }

    const factura = {
      user_id: userId,
      id_proveedor: idProveedor,
      numero_factura: numeroFactura,
      fecha_emision: fechaEmision,
      total: parseFloat(total),
      estado
    };

    if (fechaVencimiento) {
      factura.fecha_vencimiento = fechaVencimiento;
    }

    const { error } = editId
      ? await supabase
          .from("facturas")
          .update(factura)
          .eq("id", editId)
          .eq("user_id", userId)
      : await supabase.from("facturas").insert([factura]);

    if (error) {
      setMensaje(editId ? "Error al actualizar factura" : "Error al crear factura");
      return;
    }

    setMensaje(editId ? "Factura actualizada correctamente" : "Factura creada correctamente");
    resetForm();
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta factura?")) return;

    const { error } = await supabase
      .from("facturas")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      setMensaje("Error al borrar factura");
      return;
    }

    setMensaje("Factura borrada correctamente");
  };

  const handleEdit = (factura) => {
    setEditId(factura.id);
    setIdProveedor(factura.id_proveedor?.toString() || "");
    setNumeroFactura(factura.numero_factura || "");
    setFechaEmision(factura.fecha_emision || "");
    setFechaVencimiento(factura.fecha_vencimiento || "");
    setTotal(factura.total?.toString() || "");
    setEstado(factura.estado || "pendiente");
    setMensaje("");
    setShowForm(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Facturas</h2>
      <button
        onClick={() => {
          setShowForm(!showForm);
          setMensaje("");
          if (showForm) {
            resetForm();
          } else {
            setEditId(null);
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
        title={showForm ? "Cancelar" : "Crear factura"}
        aria-label={showForm ? "Cancelar" : "Crear factura"}
      >
        {showForm ? "✕" : "+"}
      </button>

      {showForm && (
        <div className="app-modal-overlay" style={{ zIndex: 1000 }}>
          <div className="app-modal-card">
            <form className="app-modal-form" onSubmit={handleSubmit}>
              <h3 style={{ marginTop: 0 }}>{editId ? "Editar factura" : "Crear factura"}</h3>
              <select
                value={idProveedor}
                onChange={(event) => setIdProveedor(event.target.value)}
                required
              >
                <option value="">Selecciona proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.id} value={proveedor.id.toString()}>
                    {proveedor.nombre_comercial}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Numero de factura"
                value={numeroFactura}
                onChange={(event) => setNumeroFactura(event.target.value)}
                required
              />
              <label htmlFor="fecha-emision">Fecha de emision</label>
              <input
                id="fecha-emision"
                type="date"
                value={fechaEmision}
                onChange={(event) => setFechaEmision(event.target.value)}
                required
              />
              <label htmlFor="fecha-vencimiento">Fecha de vencimiento</label>
              <input
                id="fecha-vencimiento"
                type="date"
                value={fechaVencimiento}
                onChange={(event) => setFechaVencimiento(event.target.value)}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Total"
                value={total}
                onChange={(event) => setTotal(event.target.value)}
                required
              />
              <select value={estado} onChange={(event) => setEstado(event.target.value)}>
                <option value="pendiente">Pendiente</option>
                <option value="pagada">Pagada</option>
                <option value="vencida">Vencida</option>
              </select>
              <button type="submit">Guardar factura</button>
            </form>
            <button
              className="app-modal-close"
              onClick={() => {
                setShowForm(false);
                resetForm();
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

      <h3 style={{ marginTop: "2rem" }}>Facturas guardadas</h3>
      {cargandoFacturas ? (
        <p>Cargando facturas...</p>
      ) : facturas.length === 0 ? (
        <p>No hay facturas registradas.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem", minWidth: 900 }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Nº factura</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Proveedor</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "center" }}>Emision</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "center" }}>Vencimiento</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>Total</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "center" }}>Estado</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "center" }}>Creada</th>
                <th style={{ borderBottom: "1px solid #ccc", textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => {
                const proveedor = proveedores.find((item) => item.id === factura.id_proveedor);

                return (
                  <tr key={factura.id}>
                    <td style={{ padding: 8 }}>{factura.numero_factura}</td>
                    <td style={{ padding: 8 }}>{proveedor?.nombre_comercial || factura.id_proveedor}</td>
                    <td style={{ padding: 8, textAlign: "center" }}>{factura.fecha_emision || ""}</td>
                    <td style={{ padding: 8, textAlign: "center" }}>{factura.fecha_vencimiento || "-"}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>
                      {Number(factura.total || 0).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                    </td>
                    <td style={{ padding: 8, textAlign: "center", textTransform: "capitalize" }}>{factura.estado || "-"}</td>
                    <td style={{ padding: 8, textAlign: "center" }}>
                      {factura.created_at ? new Date(factura.created_at).toLocaleString("es-ES") : ""}
                    </td>
                    <td style={{ padding: 8, textAlign: "center" }}>
                      <button
                        style={{ background: "none", border: "none", cursor: "pointer", marginRight: 8 }}
                        title="Editar factura"
                        aria-label="Editar factura"
                        onClick={() => handleEdit(factura)}
                      >
                        <FiEdit size={22} color="#2563eb" />
                      </button>
                      <button
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171" }}
                        title="Borrar factura"
                        aria-label="Borrar factura"
                        onClick={() => handleDelete(factura.id)}
                      >
                        <FiTrash2 size={22} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}