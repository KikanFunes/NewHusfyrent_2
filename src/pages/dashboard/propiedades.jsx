import React, { useEffect, useState } from "react";
import {
  Typography,
  Spinner,
  Input,
  Button,
  Card,
  CardBody,
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

  useEffect(() => {
    fetchPropiedades();
    fetchPropietarios();
  }, []);

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
    const { data, error } = await supabase
      .from("propietarios")
      .select("id, nombre");
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
        dormitorios: parseInt(dormitorios),
        banos: parseInt(banos),
        superficie: parseFloat(superficie),
        propietario_id,
        valor_arriendo: parseInt(valor_arriendo),
        comision: parseFloat(comision),
        fecha_ingreso,
        notas,
      },
    ]);

    if (error) {
      alert("Error al agregar propiedad");
      console.error(error);
    } else {
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
      fetchPropiedades();
    }
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
          onChange={(e) =>
            setNuevaPropiedad({ ...nuevaPropiedad, nombre: e.target.value })
          }
        />

        {/* Dirección con botón para ver en Google Maps */}
        <div className="flex gap-2">
          <Input
            label="Dirección"
            value={nuevaPropiedad.direccion}
            onChange={(e) =>
              setNuevaPropiedad({
                ...nuevaPropiedad,
                direccion: e.target.value,
              })
            }
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

        {/* Tipo de propiedad como select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-blue-gray-700">
            Tipo de Propiedad
          </label>
          <select
            value={nuevaPropiedad.tipo}
            onChange={(e) =>
              setNuevaPropiedad({ ...nuevaPropiedad, tipo: e.target.value })
            }
            className="border border-blue-gray-200 rounded-md p-2"
          >
            <option value="">Selecciona un tipo</option>
            <option value="Departamento">Departamento</option>
            <option value="Casa">Casa</option>
            <option value="Estacionamiento">Estacionamiento</option>
            <option value="Bodega">Bodega</option>
            <option value="Local">Local</option>
            <option value="Parcela">Parcela</option>
            <option value="Galpón">Galpón</option>
            <option value="Lote">Lote</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Selección de propietario y botón para agregar */}
        <div className="flex flex-col md:flex-row md:items-end gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium text-blue-gray-700">
              Propietario
            </label>
            <select
              value={nuevaPropiedad.propietario_id}
              onChange={(e) =>
                setNuevaPropiedad({
                  ...nuevaPropiedad,
                  propietario_id: e.target.value,
                })
              }
              className="border border-blue-gray-200 rounded-md p-2 w-full"
            >
              <option value="">Seleccionar propietario</option>
              {listaPropietarios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
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
          onChange={(e) =>
            setNuevaPropiedad({ ...nuevaPropiedad, dormitorios: e.target.value })
          }
        />
        <Input
          label="Baños"
          type="number"
          value={nuevaPropiedad.banos}
          onChange={(e) =>
            setNuevaPropiedad({ ...nuevaPropiedad, banos: e.target.value })
          }
        />
        <Input
          label="Superficie (m²)"
          type="number"
          value={nuevaPropiedad.superficie}
          onChange={(e) =>
            setNuevaPropiedad({ ...nuevaPropiedad, superficie: e.target.value })
          }
        />
        <Input
          label="Valor Arriendo"
          type="number"
          value={nuevaPropiedad.valor_arriendo}
          onChange={(e) =>
            setNuevaPropiedad({ ...nuevaPropiedad, valor_arriendo: e.target.value })
          }
        />
        <Input
          label="Comisión (%)"
          type="number"
          value={nuevaPropiedad.comision}
          onChange={(e) =>
            setNuevaPropiedad({ ...nuevaPropiedad, comision: e.target.value })
          }
        />
        <Input
          label="Fecha de Ingreso"
          type="date"
          value={nuevaPropiedad.fecha_ingreso}
          onChange={(e) =>
            setNuevaPropiedad({ ...nuevaPropiedad, fecha_ingreso: e.target.value })
          }
        />
        <Input
          label="Notas"
          value={nuevaPropiedad.notas}
          onChange={(e) =>
            setNuevaPropiedad({ ...nuevaPropiedad, notas: e.target.value })
          }
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
          supabase
            .from("propietarios")
            .select("id, nombre")
            .then(({ data, error }) => {
              if (!error) setListaPropietarios(data);
            });
        }}
      />
    </div>
  );
}

export default Propiedades;