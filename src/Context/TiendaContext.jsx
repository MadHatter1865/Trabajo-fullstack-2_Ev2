import { createContext, useContext, useEffect, useReducer, useState, } 
from 'react';
import { cargarTienda, guardarTienda } from '../Services/Storage.js';
import { tiendaReducer } from '../Store/tiendaReducer.js';

const TiendaContext = createContext(null);
export function TiendaProvider({ children }) {
  const [estado, dispatch] = useReducer(tiendaReducer, undefined, cargarTienda);
  const [errorGuardado, setErrorGuardado] = useState(false);
  useEffect(() => {
    setErrorGuardado(!guardarTienda(estado));
  }, [estado.productos, estado.carrito]);
  return (
    <TiendaContext.Provider value={{ estado, dispatch, errorGuardado }}>
      {children}
    </TiendaContext.Provider>
  );
}
export function useTienda() {
  const contexto = useContext(TiendaContext);
  if (!contexto)
    throw new Error('useTienda debe usarse dentro de TiendaProvider.');
  return contexto;
}
