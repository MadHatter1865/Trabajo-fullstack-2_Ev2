import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import ProductoModal from '../components/ProductoModal.jsx';
import ConfirmarModal from '../components/ConfirmarModal.jsx';
import { precioCLP, estadoStock } from '../Utils/Formatos.js';
import { useTienda } from '../Context/TiendaContext.jsx';
import Alert from 'react-bootstrap/Alert';
import { solicitudAPI } from "../Services/Api.js";
import { convertirProducto } from "../Utils/Validaciones.js";
import { useEffect } from "react";
import InventarioModal from "../components/InventarioModal.jsx";


export default function Admin() {
  const { estado, dispatch } = useTienda();
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [errorAPI, setErrorAPI] = useState('');
  const [modalInventario, setModalInventario] = useState(false);
  const [inventarios, setInventarios] = useState([]);
  const productos = estado.productos;

  useEffect(() => {
    async function cargarInventario() {
      try {
        const datos = await solicitudAPI('/api/inventario');
        setInventarios(datos);
      } catch (error) {
        setErrorAPI(error.message);
      }
    }

    cargarInventario();
  }, []);

  function crear() {
    setEditando(null);
    setModal(true);
  }
  function editar(producto) {
    setEditando(producto);
    setModal(true);
  }
  async function guardar(datos, id) {
    try {
      setErrorAPI('');
      const producto = convertirProducto(datos);
      if (id !== null) {
        await solicitudAPI(`/api/productos/${id}`, {
          method: 'PUT',
          body: JSON.stringify(producto),
        });
      } else {
        await solicitudAPI('/api/productos', {
          method: 'POST',
          body: JSON.stringify(producto),
        });
      }

      const productosActualizados = await solicitudAPI('/api/productos');
      dispatch({
        type: 'CARGAR_PRODUCTOS',
        productos: productosActualizados,
      });
      setModal(false);
    } catch (error) {
      setErrorAPI(error.message);
    }
  }

  async function guardarInventario(datos) {
    try {
      setErrorAPI('');

      await solicitudAPI('/api/inventario', {
        method: 'POST',
        body: JSON.stringify(datos),
      });

      const inventarioActualizado = await solicitudAPI('/api/inventario');

      setInventarios(inventarioActualizado);
      setModalInventario(false);
    } catch (error) {
      setErrorAPI(error.message);
    }
  }
  async function confirmarEliminar() {
    try {
      setErrorAPI('');
      await solicitudAPI(`/api/productos/${eliminando.id}`, {
        method: 'DELETE',
      });
      const productosActualizados = await solicitudAPI('/api/productos');
      dispatch({
        type: 'CARGAR_PRODUCTOS',
        productos: productosActualizados,
      });
      setEliminando(null);
    } catch (error) {
      setErrorAPI(error.message);
    }
  }
  const resumen = [
    { titulo: 'Productos', valor: productos.length },
    {
      titulo: 'Unidades de stock',
      valor: productos.reduce((total, p) => total + p.stock, 0),
    },
    {
      titulo: 'Categorías',
      valor: new Set(productos.map((p) => p.categoria)).size,
    },
  ];
  return (
    <Container as="section" className="py-4">
      <h1>Administración de productos</h1>
      <Row className="g-3 mb-4">
        {resumen.map((r) => (
          <Col sm={4} key={r.titulo}>
            <Card>
              <Card.Body>
                <h2 className="h6">{r.titulo}</h2>
                <strong className="fs-3">{r.valor}</strong>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button className="mb-3" onClick={crear}>
        Nuevo producto
      </Button>
      <Button
          className="mb-3 ms-2"
          variant="success"
          onClick={() => setModalInventario(true)}
      >
        Registrar inventario
      </Button>
      {errorAPI && (
          <Alert variant="danger" dismissible onClose={() => setErrorAPI('')}>
            No se pudo completar la operación: {errorAPI}
          </Alert>
      )}
      <Table responsive striped hover>
        <thead>
          <tr>
            {[
              'ID',
              'Producto',
              'Categoría',
              'Precio',
              'Stock',
              'Estado',
              'Acciones',
            ].map((c) => (
              <th scope="col" key={c}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productos.length ? (
            productos.map((p) => {
              const stock = estadoStock(p.stock);
              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <img
                      className="admin-thumb rounded me-2"
                      src={p.imagen}
                      alt=""
                    />
                    {p.nombre}
                  </td>
                  <td>{p.categoria}</td>
                  <td>{precioCLP(p.precio)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <Badge
                      bg={stock.variante}
                      text={stock.variante === 'warning' ? 'dark' : undefined}
                    >
                      {stock.texto}
                    </Badge>
                  </td>
                  <td className="text-nowrap">
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => editar(p)}
                    >
                      Editar {p.nombre}
                    </Button>{' '}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setEliminando(p)}
                    >
                      Eliminar {p.nombre}
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7}>No hay productos registrados.</td>
            </tr>
          )}
        </tbody>
      </Table>
      <h2 className="h4 mt-4">Inventario</h2>

      <Table responsive striped hover>
        <thead>
        <tr>
          <th>ID</th>
          <th>Producto</th>
          <th>Cantidad disponible</th>
          <th>Stock mínimo</th>
        </tr>
        </thead>

        <tbody>
        {inventarios.length ? (
            inventarios.map((item) => {
              const producto = productos.find(
                  (p) => Number(p.id) === Number(item.productoId)
              );

              return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      {producto?.nombre ?? `Producto ID ${item.productoId}`}
                    </td>
                    <td>{item.cantidad}</td>
                    <td>{item.stockMinimo}</td>
                  </tr>
              );
            })
        ) : (
            <tr>
              <td colSpan={4}>No hay registros de inventario.</td>
            </tr>
        )}
        </tbody>
      </Table>
      {modal && (
        <ProductoModal
          producto={editando}
          productos={productos}
          guardar={guardar}
          cerrar={() => setModal(false)}
        />
      )}
      {modalInventario && (
          <InventarioModal
              productos={productos}
              guardar={guardarInventario}
              cerrar={() => setModalInventario(false)}
          />
      )}
      <ConfirmarModal
        abierto={eliminando !== null}
        titulo="Eliminar producto"
        confirmar={confirmarEliminar}
        cancelar={() => setEliminando(null)}
      >
        ¿Eliminar {eliminando?.nombre}? También se retirará del carrito si está
        agregado.
      </ConfirmarModal>
    </Container>
  );
}
