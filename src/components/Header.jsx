import { Link, NavLink, useNavigate } from 'react-router';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useTienda } from '../Context/TiendaContext.jsx';
import { useAuth } from '../Context/AuthContext.jsx';
import { resumenCarrito } from '../Store/tiendaReducer.js';

export default function Header() {
  const { estado } = useTienda();
  const { sesion, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  function salir() {
    cerrarSesion();
    navigate('/', { replace: true });
  }
  return (
    <header>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">
            Ferre
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="menu-principal"
            aria-label="Abrir navegación"
          />
          <Navbar.Collapse id="menu-principal">
            <Nav className="ms-auto" aria-label="Navegación principal">
              <Nav.Link as={NavLink} to="/" end eventKey="inicio">
                Inicio
              </Nav.Link>
              <Nav.Link as={NavLink} to="/productos" eventKey="productos">
                Productos
              </Nav.Link>
              <Nav.Link as={NavLink} to="/carrito" eventKey="carrito">
                Carrito ({resumenCarrito(estado).unidades})
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contacto" eventKey="contacto">
                Contacto
              </Nav.Link>
              <Nav.Link as={NavLink} to="/admin" eventKey="admin">
                Admin
              </Nav.Link>
              {sesion ? (
                <Button
                  variant="outline-light"
                  size="sm"
                  className="ms-lg-2"
                  onClick={salir}
                >
                  Cerrar sesión
                </Button>
              ) : (
                <Nav.Link as={NavLink} to="/login" eventKey="login">
                  Ingresar
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
