import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useTienda } from '../Context/TiendaContext.jsx';
import { useAuth } from '../Context/AuthContext.jsx';

export default function Layout() {
  const { estado, dispatch, errorGuardado } = useTienda();
  const { errorGuardado: errorSesion } = useAuth();
  const { pathname } = useLocation();
  const main = useRef(null);
  useEffect(() => {
    const titulos = {
      '/': 'Inicio',
      '/productos': 'Productos',
      '/carrito': 'Carrito',
      '/contacto': 'Contacto',
      '/login': 'Ingreso',
      '/admin': 'Administración',
    };
    document.title = `${titulos[pathname] ?? 'Página no encontrada'} | Ferre`;
    main.current?.focus();
  }, [pathname]);
  return (
    <>
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} ref={main}>
        <Container>
          {(errorGuardado || errorSesion) && (
            <Alert variant="warning">
              No se pudo guardar en este navegador. Los cambios funcionan
              mientras esta página permanezca abierta.
            </Alert>
          )}
          {estado.aviso && (
            <Alert
              className="mt-3"
              variant={estado.aviso.tipo}
              dismissible
              onClose={() => dispatch({ type: 'CERRAR_AVISO' })}
              role="status"
            >
              {estado.aviso.texto}
            </Alert>
          )}
        </Container>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
