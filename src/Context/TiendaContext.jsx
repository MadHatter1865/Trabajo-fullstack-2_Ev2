
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import { cargarTienda, guardarTienda } from '../Services/Storage.js';
import { solicitudAPI } from '../Services/Api.js';
import { tiendaReducer } from '../Store/tiendaReducer.js';

const TiendaContext = createContext(null);

export function TiendaProvider({ children }) {
  const [estado, dispatch] = useReducer(
      tiendaReducer,
      undefined,
      cargarTienda,
  );

  const [errorGuardado, setErrorGuardado] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState(null);

  useEffect(() => {
    async function cargarProductosAPI() {
      try {
        setCargandoProductos(true);
        setErrorProductos(null);

        const productos = await solicitudAPI('/api/productos');

        dispatch({
          type: 'CARGAR_PRODUCTOS',
          productos,
        });
      } catch (error) {
        setErrorProductos(error.message);
      } finally {
        setCargandoProductos(false);
      }
    }

    cargarProductosAPI();
  }, []);

  useEffect(() => {
    setErrorGuardado(!guardarTienda(estado));
  }, [estado.productos, estado.carrito]);

  return (
      <TiendaContext.Provider
          value={{
            estado,
            dispatch,
            errorGuardado,
            cargandoProductos,
            errorProductos,
          }}
      >
        {children}
      </TiendaContext.Provider>
  );
}

export function useTienda() {
  const contexto = useContext(TiendaContext);

  if (!contexto) {
    throw new Error('useTienda debe usarse dentro de TiendaProvider.');
  }

  return contexto;
}
