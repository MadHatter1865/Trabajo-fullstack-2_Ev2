
import { createContext, useContext, useEffect, useState } from 'react';
import { cargarSesion, guardarSesion } from '../Services/Storage.js';
import { solicitudAPI } from '../Services/Api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(cargarSesion);
  const [errorGuardado, setErrorGuardado] = useState(false);

  useEffect(() => {
    setErrorGuardado(!guardarSesion(sesion));
  }, [sesion]);

  async function ingresar(correo, contrasena) {
    try {
      const usuario = await solicitudAPI('/api/usuarios/login', {
        method: 'POST',
        body: JSON.stringify({
          correo: correo,
          contraseña: contrasena,
        }),
      });

      setSesion({
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        usuario: usuario.correo,
        rol: usuario.rol.toLowerCase(),
        logueado: true,
      });

      return usuario;

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  }

  const cerrarSesion = () => setSesion(null);

  return (
      <AuthContext.Provider
          value={{ sesion, ingresar, cerrarSesion, errorGuardado }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }

  return contexto;
}
