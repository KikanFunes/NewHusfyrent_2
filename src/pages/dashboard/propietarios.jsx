import React, { useEffect, useState } from "react";
import {
  Typography,
  Spinner,
  Card,
  CardBody,
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { supabase } from "../../lib/supabase";
import ModalEditarPropietario from "@/components/ModalEditarPropietario";

export function Propietarios() {
  const [loading, setLoading] = useState(true);
  const [propietarios, setPropietarios] = useState([]);
  const [nuevoPropietario, setNuevoPropietario] = useState({
    nombre: "",
    rut_dni: "",
    correo: "",
    telefono: "",
    banco: "",
    tipoCuenta: "",
    numeroCuenta: "",
    fechaIngreso: "",
    notas: "",
  });

  const [modalAbierto, setModalAbierto] = useState(false);
  const [propietarioActivo, setPropietarioActivo] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState(null);

  // Función para obtener propietarios
  const fetchPropietarios = async () => {
    try {
      const { data, error } = await supabase.from("propietarios").select("*");
      if (error) {
        console.error("Error al obtener propietarios:", error.message);
      } else {
        console.log("Propietarios obtenidos:", data);
        setPropietarios(data);
      }
    } catch (e) {
      console.error("Error inesperado al obtener propietarios:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPropietarios();
  }, []);

  const handleAgregarPropietario = async () => {
    const {
      nombre,
      rut_dni,
      correo,
      telefono,
      banco,
      tipoCuenta,
      numeroCuenta,
      fechaIngreso,
      notas,
    } = nuevoPropietario;

    if (!nombre || !rut_dni) {
      alert("Nombre y RUT/DNI son obligatorios");
      return;
    }

    const cuenta_bancaria = {
      banco,
      tipo_cuenta: tipoCuenta,
      numero_cuenta: numeroCuenta,
    };

    const { error } = await supabase.from("propietarios").insert([
      {
        nombre,
        rut_dni,
        correo,
        telefono,
        cuenta_bancaria,
        fecha_ingreso: fechaIngreso,
        notas,
      },
    ]);

    if (error) {
      alert("Error al agregar propietario");
      console.error(error);
    } else {
      setNuevoPropietario({
        nombre: "",
        rut_dni: "",
        correo: "",
        telefono: "",
        banco: "",
        tipoCuenta: "",
        numeroCuenta: "",
        fechaIngreso: "",
        notas: "",
      });

      await fetchPropietarios();
    }
  };

  const verDetalles = (propietario) => {
    setPropietarioActivo(propietario);
    setModalAbierto(true);
  };

  const handleEditar = (propietario) => {
    setPropietarioSeleccionado(propietario);
    setMostrarModalEditar(true);
  };

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Lista de Propietarios
      </Typography>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Nombre" 
          value={nuevoPropietario.nombre} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, nombre: e.target.value })} 
        />
        <Input 
          label="RUT o DNI" 
          value={nuevoPropietario.rut_dni} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, rut_dni: e.target.value })} 
        />
        <Input 
          label="Correo" 
          value={nuevoPropietario.correo} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, correo: e.target.value })} 
        />
        <Input 
          label="Teléfono" 
          value={nuevoPropietario.telefono} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, telefono: e.target.value })} 
        />
        <div>
          <Select
            label="Banco"
            value={nuevoPropietario.banco}
            onChange={(val) =>
              setNuevoPropietario({ ...nuevoPropietario, banco: val })
            }
          >
            <Option value="Banco de Chile">Banco de Chile</Option>
            <Option value="Banco BCI">Banco BCI</Option>
            <Option value="Banco Estado">Banco Estado</Option>
            <Option value="Banco Santander">Banco Santander</Option>
            <Option value="Banco Itaú">Banco Itaú</Option>
            <Option value="Banco Falabella">Banco Falabella</Option>
            <Option value="Scotiabank">Scotiabank</Option>
            <Option value="Banco Bice">Banco Bice</Option>
            <Option value="Banco Internacional">Banco Internacional</Option>
            <Option value="Banco Consorcio">Banco Consorcio</Option>
            <Option value="Banco Ripley">Banco Ripley</Option>
            <Option value="HSBC">HSBC</Option>
            <Option value="Tenpo">Tenpo</Option>
            <Option value="Mercado Pago">Mercado Pago</Option>
            <Option value="Tapp Caja Los Andes">Tapp Caja Los Andes</Option>
            <Option value="Otro">Otro</Option>
          </Select>
        </div>
        <div>
          <Select
            label="Tipo de Cuenta"
            value={nuevoPropietario.tipoCuenta}
            onChange={(val) =>
              setNuevoPropietario({ ...nuevoPropietario, tipoCuenta: val })
            }
          >
            <Option value="Cuenta Corriente">Cuenta Corriente</Option>
            <Option value="Cuenta Vista">Cuenta Vista</Option>
            <Option value="Cuenta Ahorro">Cuenta Ahorro</Option>
            <Option value="Cuenta RUT">Cuenta RUT</Option>
            <Option value="Otra">Otra</Option>
          </Select>
        </div>
        <Input 
          label="Número de Cuenta" 
          value={nuevoPropietario.numeroCuenta} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, numeroCuenta: e.target.value })} 
        />
        <Input 
          type="date" 
          label="Fecha de Ingreso" 
          value={nuevoPropietario.fechaIngreso} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, fechaIngreso: e.target.value })} 
        />
        <Input 
          label="Notas" 
          value={nuevoPropietario.notas} 
          onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, notas: e.target.value })} 
        />
        <Button 
          onClick={handleAgregarPropietario} 
          color="blue" 
          className="md:col-span-2"
        >
          Agregar Propietario
        </Button>
      </div>

      {loading ? (
        <Spinner color="blue" />
      ) : (
        <>
          <Card>
            <CardBody>
              {propietarios.length === 0 ? (
                <Typography>No hay propietarios registrados.</Typography>
              ) : (
                <table className="w-full table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Nombre</th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Correo</th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Teléfono</th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propietarios.map((prop) => (
                      <tr key={prop.id}>
                        <td className="p-4 border-b border-blue-gray-50">{prop.nombre}</td>
                        <td className="p-4 border-b border-blue-gray-50">{prop.correo}</td>
                        <td className="p-4 border-b border-blue-gray-50">{prop.telefono}</td>
                        <td className="p-4 border-b border-blue-gray-50 space-x-2">
                          <Button size="sm" onClick={() => verDetalles(prop)}>
                            Ver más
                          </Button>
                          <Button
                            size="sm"
                            color="amber"
                            onClick={() => {
                              console.log("Propietario seleccionado para editar:", prop);
                              setPropietarioSeleccionado(prop);
                              setMostrarModalEditar(true);
                            }}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>

          <Dialog open={modalAbierto} handler={() => setModalAbierto(false)}>
            <DialogHeader>Detalles del Propietario</DialogHeader>
            <DialogBody>
              {propietarioActivo && (
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {propietarioActivo.nombre}</p>
                  <p><strong>RUT / DNI:</strong> {propietarioActivo.rut_dni}</p>
                  <p><strong>Correo:</strong> {propietarioActivo.correo}</p>
                  <p><strong>Teléfono:</strong> {propietarioActivo.telefono}</p>
                  <p><strong>Banco:</strong> {propietarioActivo.cuenta_bancaria?.banco}</p>
                  <p><strong>Tipo de Cuenta:</strong> {propietarioActivo.cuenta_bancaria?.tipo_cuenta}</p>
                  <p><strong>Número de Cuenta:</strong> {propietarioActivo.cuenta_bancaria?.numero_cuenta}</p>
                  <p><strong>Fecha de Ingreso:</strong> {propietarioActivo.fecha_ingreso}</p>
                  <p><strong>Notas:</strong> {propietarioActivo.notas}</p>
                </div>
              )}
            </DialogBody>
            <DialogFooter>
              <Button variant="text" onClick={() => setModalAbierto(false)} color="gray">
                Cerrar
              </Button>
            </DialogFooter>
          </Dialog>
        </>
      )}

      {mostrarModalEditar && propietarioSeleccionado && (
  <ModalEditarPropietario
    open={mostrarModalEditar}
    propietario={propietarioSeleccionado}
    onClose={() => {
      setMostrarModalEditar(false);
      setPropietarioSeleccionado(null);
    }}
    onGuardar={async (datosActualizados) => {
  console.log("=== INICIO PROCESO DE ACTUALIZACIÓN ===");
  console.log("🆔 ID recibido:", datosActualizados.id);
  console.log("🔍 Tipo del ID:", typeof datosActualizados.id);
  console.log("📋 Datos completos:", datosActualizados);

  try {
    // PASO 1: Verificar que el registro existe
    console.log("🔍 PASO 1: Verificando existencia del registro...");
    const { data: registroExistente, error: errorBusqueda } = await supabase
      .from("propietarios")
      .select("*")
      .eq("id", datosActualizados.id);

    console.log("📊 Resultado de búsqueda:", registroExistente);
    console.log("❌ Error de búsqueda:", errorBusqueda);

    if (errorBusqueda) {
      console.error("Error al buscar el registro:", errorBusqueda);
      return false;
    }

    if (!registroExistente || registroExistente.length === 0) {
      console.error("❌ El registro no existe");
      alert("Error: El propietario no existe en la base de datos");
      return false;
    }

    console.log("✅ Registro encontrado:", registroExistente[0]);

    // PASO 2: Preparar datos para actualización
    const cuenta_bancaria = {
      banco: datosActualizados.banco || null,
      tipo_cuenta: datosActualizados.tipoCuenta || null,
      numero_cuenta: datosActualizados.numeroCuenta || null
    };

    const actualizacion = {
      nombre: datosActualizados.nombre,
      rut_dni: datosActualizados.rut_dni || null,
      correo: datosActualizados.correo || null,
      telefono: datosActualizados.telefono || null,
      cuenta_bancaria,
      fecha_ingreso: datosActualizados.fechaIngreso || null,
      notas: datosActualizados.notas || null
    };

    console.log("📦 PASO 2: Objeto de actualización:", actualizacion);

    // PASO 3: Ejecutar actualización SIN .select() y SIN .single()
    console.log("🔄 PASO 3: Ejecutando actualización...");
    const { data, error, status, statusText } = await supabase
      .from("propietarios")
      .update(actualizacion)
      .eq("id", datosActualizados.id);

    console.log("📊 Resultado de actualización:");
    console.log("- Data:", data);
    console.log("- Error:", error);
    console.log("- Status:", status);
    console.log("- StatusText:", statusText);

    if (error) {
      console.error("❌ Error al actualizar:", error);
      return false;
    }

    // PASO 4: Verificar que se actualizó
    console.log("🔍 PASO 4: Verificando actualización...");
    const { data: registroActualizado, error: errorVerificacion } = await supabase
      .from("propietarios")
      .select("*")
      .eq("id", datosActualizados.id)
      .single();

    console.log("📊 Registro después de actualización:", registroActualizado);
    console.log("❌ Error de verificación:", errorVerificacion);

    if (errorVerificacion) {
      console.error("Error al verificar actualización:", errorVerificacion);
      // Pero continuamos porque el UPDATE pudo haber funcionado
    }

    // PASO 5: Refrescar tabla y cerrar modal
    console.log("🔄 PASO 5: Refrescando datos...");
    await fetchPropietarios();
    
    console.log("✅ Proceso completado exitosamente");
    return true;

  } catch (error) {
    console.error("💥 Error general en el proceso:", error);
    return false;
  }
}}
  />
)}
    </div>
  );
}

export default Propietarios;