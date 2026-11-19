
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
    validarInventario,
    convertirInventario,
} from '../Utils/Validaciones.js';

const inicial = {
    productoId: '',
    cantidad: '',
    stockMinimo: '',
};

export default function InventarioModal({
                                            productos,
                                            guardar,
                                            cerrar,
                                        }) {
    const [form, setForm] = useState(inicial);
    const [errores, setErrores] = useState({});

    function enviar(evento) {
        evento.preventDefault();

        const nuevosErrores = validarInventario(form);
        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length === 0) {
            guardar(convertirInventario(form));
        }
    }

    return (
        <Modal show onHide={cerrar} centered>
            <Modal.Header closeButton>
                <Modal.Title>Registrar inventario</Modal.Title>
            </Modal.Header>

            <Form onSubmit={enviar} noValidate>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Producto</Form.Label>

                        <Form.Select
                            value={form.productoId}
                            isInvalid={Boolean(errores.productoId)}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    productoId: e.target.value,
                                });
                                setErrores({
                                    ...errores,
                                    productoId: undefined,
                                });
                            }}
                        >
                            <option value="">Selecciona un producto</option>

                            {productos.map((producto) => (
                                <option key={producto.id} value={producto.id}>
                                    {producto.nombre}
                                </option>
                            ))}
                        </Form.Select>

                        <Form.Control.Feedback type="invalid">
                            {errores.productoId}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Cantidad disponible</Form.Label>

                        <Form.Control
                            type="number"
                            min="0"
                            step="1"
                            value={form.cantidad}
                            isInvalid={Boolean(errores.cantidad)}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    cantidad: e.target.value,
                                });
                                setErrores({
                                    ...errores,
                                    cantidad: undefined,
                                });
                            }}
                        />

                        <Form.Control.Feedback type="invalid">
                            {errores.cantidad}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Stock mínimo</Form.Label>

                        <Form.Control
                            type="number"
                            min="0"
                            step="1"
                            value={form.stockMinimo}
                            isInvalid={Boolean(errores.stockMinimo)}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    stockMinimo: e.target.value,
                                });
                                setErrores({
                                    ...errores,
                                    stockMinimo: undefined,
                                });
                            }}
                        />

                        <Form.Control.Feedback type="invalid">
                            {errores.stockMinimo}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrar}>
                        Cancelar
                    </Button>

                    <Button type="submit">
                        Guardar inventario
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
