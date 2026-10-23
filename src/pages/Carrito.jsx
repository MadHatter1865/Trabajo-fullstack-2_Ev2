import { useState } from 'react';
import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ConfirmarModal from '../components/ConfirmarModal.jsx';
import { precioCLP } from '../Utils/Formatos.js';
import { useTienda } from '../Context/TiendaContext.jsx';
import { detalleCarrito, resumenCarrito } from '../Store/tiendaReducer.js';

export default function Carrito() {
  const { estado, dispatch } = useTienda();
  const [confirmacion, setConfirmacion] = useState(null);
  const detalle = detalleCarrito(estado);
  const resumen = resumenCarrito(estado);
  const stockCambio = detalle.some((p) => p.cantidad > p.stock);
  function confirmar() {
    dispatch({ type: confirmacion === 'compra' ? 'COMPRAR' : 'VACIAR' });
    setConfirmacion(null);
  }
  return (
    <Container as="section" className="py-4">
      <h1>Mi carrito</h1>
      {stockCambio && (
        <Alert variant="warning">
          El stock cambió. Reduce las cantidades o elimina los productos
          agotados.
        </Alert>
      )}
      {!detalle.length ? (
        <Alert variant="info">Tu carrito está vacío.</Alert>
      ) : (
        <>
          {detalle.map((p) => (
            <Card as="article" className="mb-3" key={p.id}>
              <Card.Body className="d-flex align-items-center gap-3 flex-wrap">
                <img className="cart-image rounded" src={p.imagen} alt="" />
                <div className="me-auto">
                  <h2 className="h6">{p.nombre}</h2>
                  <p className="mb-1">
                    {precioCLP(p.precio)} · {p.categoria}
                  </p>
                  <small>Stock: {p.stock}</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    aria-label={`Quitar una unidad de ${p.nombre}`}
                    onClick={() =>
                      dispatch({
                        type: 'CANTIDAD',
                        id: p.id,
                        cantidad: Math.min(p.stock, p.cantidad - 1),
                      })
                    }
                  >
                    −
                  </Button>
                  <span aria-label={`Cantidad de ${p.nombre}`}>
                    {p.cantidad}
                  </span>
                  <Button
                    variant="outline-secondary"
                    aria-label={`Agregar una unidad de ${p.nombre}`}
                    disabled={p.cantidad >= p.stock}
                    onClick={() =>
                      dispatch({
                        type: 'CANTIDAD',
                        id: p.id,
                        cantidad: p.cantidad + 1,
                      })
                    }
                  >
                    +
                  </Button>
                </div>
                <strong>{precioCLP(p.precio * p.cantidad)}</strong>
                <Button
                  variant="outline-danger"
                  onClick={() => dispatch({ type: 'QUITAR', id: p.id })}
                >
                  Eliminar {p.nombre}
                </Button>
              </Card.Body>
            </Card>
          ))}
          <Card className="mb-3">
            <Card.Body>
              <p>Unidades: {resumen.unidades}</p>
              <p>Subtotal: {precioCLP(resumen.subtotal)}</p>
              <p>Envío simulado: {precioCLP(resumen.envio)}</p>
              <h2 className="h4">Total: {precioCLP(resumen.total)}</h2>
              <Button
                disabled={stockCambio}
                onClick={() => setConfirmacion('compra')}
              >
                Finalizar compra
              </Button>{' '}
              <Button
                variant="outline-danger"
                onClick={() => setConfirmacion('vaciar')}
              >
                Vaciar carrito
              </Button>
            </Card.Body>
          </Card>
        </>
      )}
      <Button as={Link} to="/productos" variant="outline-primary">
        Continuar comprando
      </Button>
      <ConfirmarModal
        abierto={confirmacion !== null}
        titulo={
          confirmacion === 'compra' ? 'Confirmar compra' : 'Vaciar carrito'
        }
        confirmar={confirmar}
        cancelar={() => setConfirmacion(null)}
      >
        {confirmacion === 'compra'
          ? 'Se descontará el stock de los productos y se vaciará el carrito. Esta compra es una simulación.'
          : '¿Deseas retirar todos los productos del carrito?'}
      </ConfirmarModal>
    </Container>
  );
}
