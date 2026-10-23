import { afterEach, beforeEach, describe, expect, it, vi, } from 'vitest';
import {
  cargarTienda,
  guardarTienda,
  cargarSesion,
  CLAVES,
} from './Storage.js';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('persistencia', () => {
  it('recupera catálogo y carrito después de guardar', () => {
    const inicial = cargarTienda();
    inicial.carrito = [{ id: 1, cantidad: 2 }];
    expect(guardarTienda(inicial)).toBe(true);
    expect(cargarTienda().carrito).toEqual([{ id: 1, cantidad: 2 }]);
  });
  it('se recupera de JSON corrupto y estructuras inválidas', () => {
    localStorage.setItem(CLAVES.tienda, '{invalido');
    expect(cargarTienda().productos).toHaveLength(5);
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({ productos: 'incorrecto', carrito: null }),
    );
    expect(cargarTienda().productos).toHaveLength(5);
    expect(cargarTienda().carrito).toEqual([]);
  });
  it('limpia productos inexistentes, cantidades inválidas y filas duplicadas', () => {
    const inicial = cargarTienda();
    localStorage.removeItem(CLAVES.tienda);
    inicial.carrito = [
      { id: 1, cantidad: 2 },
      { id: 1, cantidad: 2 },
      { id: 99, cantidad: 1 },
      { id: 2, cantidad: -1 },
    ];
    guardarTienda(inicial);
    expect(cargarTienda().carrito).toEqual([{ id: 1, cantidad: 2 }]);
  });
  it('migra las claves de la primera entrega React', () => {
    const inicial = cargarTienda();
    localStorage.setItem(
      'Ferreteria-react-productos',
      JSON.stringify(inicial.productos),
    );
    localStorage.setItem(
      'Ferreteria-react-carrito',
      JSON.stringify([{ id: 2, cantidad: 3 }]),
    );
    expect(cargarTienda().carrito).toEqual([{ id: 2, cantidad: 3 }]);
  });
  it('informa si el navegador rechaza la escritura', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Sin espacio');
    });
    expect(guardarTienda(cargarTienda())).toBe(false);
  });
  it('descarta una sesión sin el rol académico permitido', () => {
    localStorage.setItem(
      CLAVES.sesion,
      JSON.stringify({ usuario: 'otro', rol: 'cliente' }),
    );
    expect(cargarSesion()).toBeNull();
  });
});
