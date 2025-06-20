import React, { useEffect, useState } from "react";
import {
  Typography,
  Spinner,
  Input,
  Button,
  Card,
  CardBody,
  Select,
  Option,
} from "@material-tailwind/react";
import { supabase } from "../../lib/supabase";
import ModalAgregarPropietario from "@/components/ModalAgregarPropietario";

export function Propiedades() {
  const [loading, setLoading] = useState(true);
  const [propiedades, setPropiedades] = useState([]);
  const [nuevaPropiedad, setNuevaPropiedad] = useState({
    nombre: "",
    direccion: "",
    tipo: "",
    dormitorios: "",
    banos: "",
    superficie: "",
    propietario_id: "",
    valor_arriendo: "",
    comision: "",
    fecha_ingreso: "",
    notas: "",
  });
  const [listaPropietarios, setListaPropietarios] = useState([]);
  const [mostrarModalPropietario, setMostrarModalPropietario] = useState(false);
  
  // Estado para el Select con renderizado forzado
  const [selectedPropietarioId, setSelectedPropietarioId] = useState("");
  const [forceRerender, setForceRerender] = useState(0);

  useEffect(() => {
    fetchPropiedades();
    fetchPropietarios();
  }, []);

  useEffect(() => {
    if (selectedPropietarioId !== nuevaPropiedad.propietario_id) {
      setNuevaPropiedad(prev => ({
        ...prev,
        propietario_id: selectedPropietarioId
      }));
    }
  }, [selectedPropietarioId]);

  const fetchPropiedades = async () => {
    const { data, error } = await supabase.from("propiedades").select("*");
    if (error) {
      console.error("Error al obtener propiedades:", error.message);
    } else {
      setPropiedades(data);
    }
    setLoading(false);
  };

  const fetchPropietarios = async () => {
    const { data, error } = await supabase.from("propietarios").select("id, nombre");
    if (error) {
      console.error("Error al obtener propietarios:", error.message);
    } else {
      setListaPropietarios(data);
    }
  };

  const handleAgregarPropiedad = async () => {
    const {
      nombre,
      direccion,
      tipo,
      dormitorios,
      banos,
      superficie,
      propietario_id,
      valor_arriendo,
      comision,
      fecha_ingreso,
      notas,
    } = nuevaPropiedad;

    if (!nombre || !direccion) {
      alert("Nombre y Dirección son obligatorios");
      return;
    }

    const { error } = await supabase.from("propiedades").insert([
      {
        nombre,
        direccion,
        tipo,
        dormitorios: parseInt(dormitorios) || null,
        banos: parseInt(banos) || null,
        superficie: parseFloat(superficie) || null,
        propietario_id: propietario_id || null,
        valor_arriendo: parseInt(valor_arriendo) || null,
        comision: parseFloat(comision) || null,
        fecha_ingreso,
        notas,
      },
    ]);

    if (error) {
      alert("Error al agregar propiedad");
      console.error(error);
    } else {
      // Reset con forzado de re-render
      setSelectedPropietarioId("");
      setNuevaPropiedad({
        nombre: "",
        direccion: "",
        tipo: "",
        dormitorios: "",
        banos: "",
        superficie: "",
        propietario_id: "",
        valor_arriendo: "",
        comision: "",
        fecha_ingreso: "",
        notas: "",
      });
      setForceRerender(prev => prev + 1);
      fetchPropiedades();
    }
  };

  // Función para manejar la selección con setTimeout
  const handlePropietarioChange = (val) => {
    // Actualizar inmediatamente
    setSelectedPropietarioId(val || "");
    
    // Forzar re-render después de un pequeño delay
    setTimeout(() => {
      setForceRerender(prev => prev + 1);
    }, 10);
  };

  return (
    <div className="p-6">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Lista de Propiedades
      </Typography>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre o identificador de la Propiedad"
          value={nuevaPropiedad.nombre}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, nombre: e.target.value })}
        />

        <div className="flex gap-2">
          <Input
            label="Dirección"
            value={nuevaPropiedad.direccion}
            onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, direccion: e.target.value })}
            className="flex-1"
          />
          <Button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  nuevaPropiedad.direccion
                )}`,
                "_blank"
              )
            }
            color="blue"
            className="mt-1"
          >
            Ver
          </Button>
        </div>

        <Select
          label="Tipo de Propiedad"
          value={nuevaPropiedad.tipo}
          onChange={(val) => setNuevaPropiedad({ ...nuevaPropiedad, tipo: val })}
        >
          <Option value="Departamento">Departamento</Option>
          <Option value="Casa">Casa</Option>
          <Option value="Estacionamiento">Estacionamiento</Option>
          <Option value="Bodega">Bodega</Option>
          <Option value="Local">Local</Option>
          <Option value="Parcela">Parcela</Option>
          <Option value="Galpón">Galpón</Option>
          <Option value="Lote">Lote</Option>
          <Option value="Otro">Otro</Option>
        </Select>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Select
              key={`propietario-${forceRerender}`}
              label="Propietario"
              value={selectedPropietarioId}
              onChange={handlePropietarioChange}
            >
              {listaPropietarios.map((propietario) => (
                <Option key={propietario.id} value={propietario.id}>
                  {propietario.nombre}
                </Option>
              ))}
            </Select>
          </div>
          <Button
            onClick={() => setMostrarModalPropietario(true)}
            color="green"
            className="mt-1"
          >
            +
          </Button>
        </div>

        <Input
          label="Dormitorios"
          type="number"
          value={nuevaPropiedad.dormitorios}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, dormitorios: e.target.value })}
        />
        <Input
          label="Baños"
          type="number"
          value={nuevaPropiedad.banos}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, banos: e.target.value })}
        />
        <Input
          label="Superficie (m²)"
          type="number"
          value={nuevaPropiedad.superficie}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, superficie: e.target.value })}
        />
        <Input
          label="Valor Arriendo"
          type="number"
          value={nuevaPropiedad.valor_arriendo}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, valor_arriendo: e.target.value })}
        />
        <Input
          label="Comisión (%)"
          type="number"
          value={nuevaPropiedad.comision}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, comision: e.target.value })}
        />
        <Input
          label="Fecha de Ingreso"
          type="date"
          value={nuevaPropiedad.fecha_ingreso}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, fecha_ingreso: e.target.value })}
        />
        <Input
          label="Notas"
          value={nuevaPropiedad.notas}
          onChange={(e) => setNuevaPropiedad({ ...nuevaPropiedad, notas: e.target.value })}
        />

        <Button onClick={handleAgregarPropiedad} color="blue" className="md:col-span-2">
          Agregar Propiedad
        </Button>
      </div>

      {loading ? (
        <Spinner color="blue" />
      ) : (
        <Card>
          <CardBody>
            {propiedades.length === 0 ? (
              <Typography>No hay propiedades registradas.</Typography>
            ) : (
              <Typography>{propiedades.length} propiedad(es) registrada(s).</Typography>
            )}
          </CardBody>
        </Card>
      )}

      <ModalAgregarPropietario
        open={mostrarModalPropietario}
        onClose={() => setMostrarModalPropietario(false)}
        onAgregado={() => {
          fetchPropietarios();
        }}
      />
    </div>
  );
}

export default Propiedades;