import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
} from "@material-tailwind/react";
import { supabase } from "../lib/supabase";

export default function ModalEditarPropietario({ open, onClose, propietario, onActualizado }) {
  const [formulario, setFormulario] = useState({
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

  useEffect(() => {
    if (propietario) {
      setFormulario({
        nombre: propietario.nombre || "",
        rut_dni: propietario.rut_dni || "",
        correo: propietario.correo || "",
        telefono: propietario.telefono || "",
        banco: propietario.cuenta_bancaria?.banco || "",
        tipoCuenta: propietario.cuenta_bancaria?.tipo_cuenta || "",
        numeroCuenta: propietario.cuenta_bancaria?.numero_cuenta || "",
        fechaIngreso: propietario.fecha_ingreso || "",
        notas: propietario.notas || "",
      });
    }
  }, [propietario]);

  const handleGuardarCambios = async () => {
    const cuenta_bancaria = {
      banco: formulario.banco,
      tipo_cuenta: formulario.tipoCuenta,
      numero_cuenta: formulario.numeroCuenta,
    };

    const { error } = await supabase
      .from("propietarios")
      .update({
        nombre: formulario.nombre,
        rut_dni: formulario.rut_dni,
        correo: formulario.correo,
        telefono: formulario.telefono,
        cuenta_bancaria,
        fecha_ingreso: formulario.fechaIngreso,
        notas: formulario.notas,
      })
      .eq("id", propietario.id);

    if (error) {
      alert("Error al actualizar");
      console.error(error);
    } else {
      onActualizado(); // Para recargar la lista
      onClose(); // Para cerrar el modal
    }
  };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Editar Propietario</DialogHeader>
      <DialogBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nombre" value={formulario.nombre} onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })} />
        <Input label="RUT/DNI" value={formulario.rut_dni} onChange={(e) => setFormulario({ ...formulario, rut_dni: e.target.value })} />
        <Input label="Correo" value={formulario.correo} onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })} />
        <Input label="Teléfono" value={formulario.telefono} onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })} />
        <Input label="Banco" value={formulario.banco} onChange={(e) => setFormulario({ ...formulario, banco: e.target.value })} />
        <Input label="Tipo de Cuenta" value={formulario.tipoCuenta} onChange={(e) => setFormulario({ ...formulario, tipoCuenta: e.target.value })} />
        <Input label="Número de Cuenta" value={formulario.numeroCuenta} onChange={(e) => setFormulario({ ...formulario, numeroCuenta: e.target.value })} />
        <Input type="date" label="Fecha de Ingreso" value={formulario.fechaIngreso} onChange={(e) => setFormulario({ ...formulario, fechaIngreso: e.target.value })} />
        <Input label="Notas" value={formulario.notas} onChange={(e) => setFormulario({ ...formulario, notas: e.target.value })} />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>Cancelar</Button>
        <Button color="blue" onClick={handleGuardarCambios}>Guardar</Button>
      </DialogFooter>
    </Dialog>
  );
}