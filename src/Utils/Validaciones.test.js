import { describe, expect, it } from 'vitest';
import { validarContacto, validarProducto } from './Validaciones.js';

const valido = {
  nombre: 'Lata De Pintura',
  categoria: 'Pintura',
  precio: '10000',
  stock: '0',
  imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwiwHTMJ09xue2mqf2TJfZOWf-Anmf649WCN70FoAasEFeRt3pYyaFrUm&s=10',
};
describe('formularios', () => {
  it('acepta un producto válido incluso con stock cero', () => {
    expect(validarProducto(valido, [])).toEqual({});
  });
  it('informa todos los campos incorrectos en una misma validación', () => {
    expect(
      Object.keys(
        validarProducto(
          {
            nombre: ' ',
            categoria: 'x',
            precio: '',
            stock: '1.5',
            imagen: 'javascript:alert(1)',
          },
          [],
        ),
      ),
    ).toEqual(['nombre', 'categoria', 'precio', 'stock', 'imagen']);
  });
  it('permite conservar el nombre del producto al editarlo', () => {
    expect(validarProducto(valido, [{ ...valido, id: 1 }], 1)).toEqual({});
  });
  it('muestra los tres errores de contacto sin detenerse en el primero', () => {
    expect(
      Object.keys(validarContacto({ email: 'mal', asunto: 'a', mensaje: 'b' })),
    ).toEqual(['email', 'asunto', 'mensaje']);
  });
  it('acepta un mensaje con caracteres válidos y rechaza un asunto demasiado largo', () => {
    expect(
      validarContacto({
        email: 'alumno@duoc.cl',
        asunto: 'Consulta por stock',
        mensaje: 'Necesito más información del producto.',
      }),
    ).toEqual({});
    expect(
      validarContacto({
        email: 'alumno@duoc.cl',
        asunto: 'a'.repeat(101),
        mensaje: 'Mensaje suficientemente largo.',
      }),
    ).toHaveProperty('asunto');
  });
});
