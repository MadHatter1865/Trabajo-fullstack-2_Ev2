const API_URL = 'https://ferreteria-backend.duckdns.org';

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