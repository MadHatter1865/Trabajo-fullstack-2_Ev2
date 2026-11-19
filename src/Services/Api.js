const API_URL = 'http://3.216.153.110:8080';

export async function solicitudAPI(ruta, opciones = {}) {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
            'Content-Type': 'application/json',
            ...opciones.headers,
        },
    });

    if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
    }

    if (respuesta.status === 204) {
        return null;
    }

    return respuesta.json();
}