// src/components/ModalEditarPropietario.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import { supabase } from "../lib/supabase";

const ModalEditarPropietario = ({ open, onClose, propietario, onGuardar }) => {
  const [datos, setDatos] = useState({
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
      setDatos({
        id: propietario.id,
        nombre: propietario.nombre || "",
        rut_dni: propietario.rut_dni || "",
        correo: propietario.correo || "",
        telefono: propietario.telefono || "",
        banco: propietario.cuenta_bancaria?.banco || "",
        tipoCuenta: propietario.cuenta_bancaria?.tipo_cuenta || "",
        numeroCuenta: propietario.cuenta_bancaria?.numero_cuenta || "",
        fechaIngreso: propietario.fecha_ingreso?.split("T")[0] || "",
        notas: propietario.notas || "",
      });
    }
  }, [propietario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

    const handleGuardar = async () => {
        if (onGuardar) {
         const exito = await onGuardar(datos);
         if (exito) {
            onClose();
         }
        }
    };

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Editar Propietario</DialogHeader>
      <DialogBody className="grid gap-4">
        <Input label="Nombre" name="nombre" value={datos.nombre} onChange={handleChange} />
        <Input label="RUT/DNI" name="rut_dni" value={datos.rut_dni} onChange={handleChange} />
        <Input label="Correo" name="correo" value={datos.correo} onChange={handleChange} />
        <Input label="Teléfono" name="telefono" value={datos.telefono} onChange={handleChange} />
        <div>
            <label className="text-sm font-medium text-blue-gray-700 mb-1 block">
                Banco
            </label>
            <select
                name="banco"
                value={datos.banco || ""}
                onChange={handleChange}
                className="border border-blue-gray-200 rounded-md p-2 w-full"
            >
                <option value="">Selecciona un banco</option>
                <option value="Banco de Chile">Banco de Chile</option>
                <option value="Banco BCI">Banco BCI</option>
                <option value="Banco Estado">Banco Estado</option>
                <option value="Banco Santander">Banco Santander</option>
                <option value="Banco Itaú">Banco Itaú</option>
                <option value="Banco Falabella">Banco Falabella</option>
                <option value="Scotiabank">Scotiabank</option>
                <option value="Banco Bice">Banco Bice</option>
                <option value="Banco Internacional">Banco Internacional</option>
                <option value="Banco Consorcio">Banco Consorcio</option>
                <option value="Banco Ripley">Banco Ripley</option>
                <option value="HSBC">HSBC</option>
                <option value="Tenpo">Tenpo</option>
                <option value="Mercado Pago">Mercado Pago</option>
                <option value="Tapp Caja Los Andes">Tapp Caja Los Andes</option>
                <option value="Otro">Otro</option>
            </select>
        </div>
        <div>
            <label className="text-sm font-medium text-blue-gray-700 mb-1 block">
                Tipo de Cuenta
            </label>
            <select
                name="tipoCuenta"
                value={datos.tipoCuenta || ""}
                onChange={handleChange}
                className="border border-blue-gray-200 rounded-md p-2 w-full"
            >
                <option value="">Selecciona una opción</option>
                <option value="Cuenta Corriente">Cuenta Corriente</option>
                <option value="Cuenta Vista">Cuenta Vista</option>
                <option value="Cuenta Ahorro">Cuenta Ahorro</option>
                <option value="Cuenta RUT">Cuenta RUT</option>
                <option value="Otra">Otra</option>
            </select>
        </div>
        <Input label="Número de Cuenta" name="numeroCuenta" value={datos.numeroCuenta} onChange={handleChange} />
        <Input label="Fecha de Ingreso" type="date" name="fechaIngreso" value={datos.fechaIngreso} onChange={handleChange} />
        <Input label="Notas" name="notas" value={datos.notas} onChange={handleChange} />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>Cancelar</Button>
        <Button color="blue" onClick={handleGuardar}>Guardar Cambios</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalEditarPropietario;