
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useAuth } from '../Context/AuthContext.jsx';

export default function Login() {
    const { sesion, ingresar } = useAuth();

    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const destinoAdmin = location.state?.desde?.startsWith('/admin')
        ? location.state.desde
        : '/admin';

    if (sesion?.rol === 'admin') {
        return <Navigate to={destinoAdmin} replace />;
    }

    if (sesion?.rol === 'cliente') {
        return <Navigate to="/" replace />;
    }

    async function enviar(evento) {
        evento.preventDefault();
        setError('');
        setCargando(true);

        try {
            const resultado = await ingresar(usuario, contrasena);

            if (resultado) {
                navigate(
                    resultado.rol.toLowerCase() === 'admin' ? destinoAdmin : '/',
                    { replace: true }
                );
            }else {
                setError('Correo o contraseña incorrectos.');
            }
        } catch (error) {
            setError('No fue posible conectar con el servidor.');
        } finally {
            setCargando(false);
        }
    }

    return (
        <Container as="section" className="py-4">
            <h1>Inicio de sesión</h1>
            <p>Ingresa con tu correo electrónico y contraseña.</p>

            <Form className="formulario-login" onSubmit={enviar}>
                <Form.Group controlId="usuario" className="mb-3">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                        type="email"
                        value={usuario}
                        onChange={(e) => {
                            setUsuario(e.target.value);
                            setError('');
                        }}
                        autoComplete="username"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="contrasena" className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        value={contrasena}
                        onChange={(e) => {
                            setContrasena(e.target.value);
                            setError('');
                        }}
                        autoComplete="current-password"
                        required
                    />
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}

                <Button type="submit" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </Button>
            </Form>
        </Container>
    );
}
