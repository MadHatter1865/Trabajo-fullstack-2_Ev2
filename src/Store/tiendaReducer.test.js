import { describe, expect, it } from 'vitest';
import {
  crearEstado,
  tiendaReducer,
  detalleCarrito,
  resumenCarrito,
} from './tiendaReducer.js';

const producto = {
  id: 1,
  nombre: 'Lata De Pintura',
  precio: 10000,
  stock: 2,
  categoria: 'Pintura',
  imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwiwHTMJ09xue2mqf2TJfZOWf-Anmf649WCN70FoAasEFeRt3pYyaFrUm&s=10',
};
const iniciar = () => crearEstado([{ ...producto }]);

describe('reglas del carrito', () => {
  it('acumula cantidades sin duplicar productos ni mutar el estado anterior', () => {
    const inicial = iniciar();
    const uno = tiendaReducer(inicial, { type: 'AGREGAR', id: 1 });
    const dos = tiendaReducer(uno, { type: 'AGREGAR', id: 1 });
    expect(dos.carrito).toEqual([{ id: 1, cantidad: 2 }]);
    expect(inicial.carrito).toEqual([]);
    expect(inicial.productos[0].stock).toBe(2);
  });
  it('rechaza agregar más unidades que el stock disponible', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 2 }]);
    const siguiente = tiendaReducer(inicial, { type: 'AGREGAR', id: 1 });
    expect(siguiente.carrito).toEqual(inicial.carrito);
    expect(siguiente.aviso.tipo).toBe('warning');
  });
  it('impide agregar productos sin stock o que no existen', () => {
    const inicial = crearEstado([{ ...producto, stock: 0 }]);
    expect(tiendaReducer(inicial, { type: 'AGREGAR', id: 1 }).carrito).toEqual(
      [],
    );
    expect(tiendaReducer(inicial, { type: 'AGREGAR', id: 99 }).carrito).toEqual(
      [],
    );
  });
  it.each([-1, 1.5, 3, NaN])('rechaza la cantidad inválida %s', (cantidad) => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 1 }]);
    expect(
      tiendaReducer(inicial, { type: 'CANTIDAD', id: 1, cantidad }).carrito,
    ).toEqual(inicial.carrito);
  });
  it('retira un producto si su cantidad llega a cero', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 1 }]);
    expect(
      tiendaReducer(inicial, { type: 'CANTIDAD', id: 1, cantidad: 0 }).carrito,
    ).toEqual([]);
  });
  it('calcula subtotal, envío y total usando cantidad', () => {
    expect(
      resumenCarrito(crearEstado([producto], [{ id: 1, cantidad: 2 }])),
    ).toEqual({ subtotal: 20000, envio: 3990, total: 23990, unidades: 2 });
    expect(resumenCarrito(iniciar())).toEqual({
      subtotal: 0,
      envio: 0,
      total: 0,
      unidades: 0,
    });
  });
  it('descuenta stock y vacía el carrito al comprar', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 2 }]);
    const compra = tiendaReducer(inicial, { type: 'COMPRAR' });
    expect(compra.productos[0].stock).toBe(0);
    expect(compra.carrito).toEqual([]);
    expect(inicial.productos[0].stock).toBe(2);
  });
  it('rechaza una compra completa si un producto perdió stock', () => {
    const inicial = crearEstado(
      [producto, { ...producto, id: 2, stock: 0 }],
      [
        { id: 1, cantidad: 1 },
        { id: 2, cantidad: 1 },
      ],
    );
    const rechazado = tiendaReducer(inicial, { type: 'COMPRAR' });
    expect(rechazado.productos).toEqual(inicial.productos);
    expect(rechazado.carrito).toEqual(inicial.carrito);
    expect(rechazado.aviso.tipo).toBe('danger');
  });
});

describe('reglas del CRUD', () => {
  it('crea un producto con id único y convierte números del formulario', () => {
    const nuevo = {
      ...producto,
      nombre: 'Taladro',
      precio: '15000',
      stock: '4',
    };
    const resultado = tiendaReducer(iniciar(), {
      type: 'GUARDAR_PRODUCTO',
      id: null,
      datos: nuevo,
    });
    expect(resultado.productos[1]).toMatchObject({
      id: 2,
      nombre: 'Taladro',
      precio: 15000,
      stock: 4,
    });
  });
  it('actualiza el precio manteniendo el id y el carrito consulta ese precio', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 2 }]);
    const resultado = tiendaReducer(inicial, {
      type: 'GUARDAR_PRODUCTO',
      id: 1,
      datos: { ...producto, precio: 15000 },
    });
    expect(resultado.productos).toHaveLength(1);
    expect(detalleCarrito(resultado)[0].precio).toBe(15000);
    expect(resumenCarrito(resultado).subtotal).toBe(30000);
  });
  it('rechaza duplicados normalizados y precios no válidos', () => {
    const inicial = iniciar();
    const duplicado = tiendaReducer(inicial, {
      type: 'GUARDAR_PRODUCTO',
      id: null,
      datos: { ...producto, nombre: '  Lata De Pintura ' },
    });
    const negativo = tiendaReducer(inicial, {
      type: 'GUARDAR_PRODUCTO',
      id: null,
      datos: { ...producto, nombre: 'Otra Lata De Pintura', precio: -1 },
    });
    expect(duplicado.productos).toEqual(inicial.productos);
    expect(negativo.productos).toEqual(inicial.productos);
  });
  it('elimina el producto tanto del catálogo como del carrito', () => {
    const inicial = crearEstado([producto], [{ id: 1, cantidad: 1 }]);
    const resultado = tiendaReducer(inicial, {
      type: 'ELIMINAR_PRODUCTO',
      id: 1,
    });
    expect(resultado.productos).toEqual([]);
    expect(resultado.carrito).toEqual([]);
  });
});
