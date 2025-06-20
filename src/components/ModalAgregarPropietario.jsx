import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
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
      onActualizado();
      onClose();
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

        <Select label="Banco" value={formulario.banco} onChange={(val) => setFormulario({ ...formulario, banco: val })}>
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

        <Select label="Tipo de Cuenta" value={formulario.tipoCuenta} onChange={(val) => setFormulario({ ...formulario, tipoCuenta: val })}>
          <Option value="Cuenta Corriente">Cuenta Corriente</Option>
          <Option value="Cuenta Vista">Cuenta Vista</Option>
          <Option value="Cuenta Ahorro">Cuenta Ahorro</Option>
          <Option value="Cuenta RUT">Cuenta RUT</Option>
          <Option value="Otra">Otra</Option>
        </Select>

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