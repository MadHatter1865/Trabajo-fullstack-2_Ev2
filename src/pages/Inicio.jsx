import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function Inicio() {
  const accesos = [
    {
      titulo: 'Explorar',
      texto: 'Busca y filtra por categoría, precio y disponibilidad.',
      ruta: '/productos',
      boton: 'Ver productos',
    },
    {
      titulo: 'Comprar',
      texto: 'Agrega productos al carrito y controla cantidades y stock.',
      ruta: '/carrito',
      boton: 'Ir al carrito',
    },
    {
      titulo: 'Administrar',
      texto: 'Crea, edita y elimina productos en el panel de administración.',
      ruta: '/admin',
      boton: 'Acceso admin',
    },
  ];
  return (
    <>
      <section className="hero py-5">
        <Container className="text-center py-4">
          <h1 className="display-4 fw-bold">Herramientas para casa y jardin</h1>
          <p className="lead">
            Todo lo que necesitas para arreglar tu hogar
          </p>
          <Button as={Link} to="/productos" size="lg">
            Explorar catálogo
          </Button>
        </Container>
      </section>
      <section className="py-5">
        <Container>
          <h2 className="text-center">Bienvenido a Ferre</h2>
          <p className="text-center">
            Tenemos todo tipo de herramientas.
          </p>
          <Row className="g-4 mt-3">
            {accesos.map((a) => (
              <Col md={4} key={a.ruta}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <h3 className="h5">{a.titulo}</h3>
                    <p>{a.texto}</p>
                    <Button as={Link} to={a.ruta} variant="outline-primary">
                      {a.boton}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}
