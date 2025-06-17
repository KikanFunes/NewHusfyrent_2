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
} from "@material-tailwind/react";
import { supabase } from "../../lib/supabase";

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

  const verDetalles = (propietario) => {
    setPropietarioActivo(propietario);
    setModalAbierto(true);
  };

  useEffect(() => {
    async function fetchPropietarios() {
      const { data, error } = await supabase.from("propietarios").select("*");

      if (error) {
        console.error("Error al obtener propietarios:", error.message);
      } else {
        setPropietarios(data);
      }

      setLoading(false);
    }

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

      const { data } = await supabase.from("propietarios").select("*");
      setPropietarios(data);
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Lista de Propietarios
      </Typography>

      {/* Formulario */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombre" value={nuevoPropietario.nombre} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, nombre: e.target.value })} />
        <Input label="RUT o DNI" value={nuevoPropietario.rut_dni} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, rut_dni: e.target.value })} />
        <Input label="Correo" value={nuevoPropietario.correo} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, correo: e.target.value })} />
        <Input label="Teléfono" value={nuevoPropietario.telefono} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, telefono: e.target.value })} />
        <Input label="Banco" value={nuevoPropietario.banco} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, banco: e.target.value })} />
        <Input label="Tipo de Cuenta" value={nuevoPropietario.tipoCuenta} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, tipoCuenta: e.target.value })} />
        <Input label="Número de Cuenta" value={nuevoPropietario.numeroCuenta} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, numeroCuenta: e.target.value })} />
        <Input type="date" label="Fecha de Ingreso" value={nuevoPropietario.fechaIngreso} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, fechaIngreso: e.target.value })} />
        <Input label="Notas" value={nuevoPropietario.notas} onChange={(e) => setNuevoPropietario({ ...nuevoPropietario, notas: e.target.value })} />
        <Button onClick={handleAgregarPropietario} color="blue" className="md:col-span-2">Agregar Propietario</Button>
      </div>

      {/* Tabla */}
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
                        <td className="p-4 border-b border-blue-gray-50">
                          <Button size="sm" onClick={() => verDetalles(prop)}>Ver más</Button>
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
    </div>
  );
}

export default Propietarios;
