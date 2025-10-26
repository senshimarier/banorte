const API_BASE = 'http://localhost:5000/api';

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) throw new Error('Error en la API');
        return await response.json();
    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor. Verifica que el backend esté corriendo.');
        return null;
    }
}

// Funciones específicas para cada pantalla
async function proyectar(tipo, periodos, id) {
    const endpoint = `/v1/${tipo}/proyectar?${tipo === 'personal' ? 'meses' : 'trimestres'}=${periodos}&${tipo === 'personal' ? 'id_usuario' : 'empresa_id'}=${id}`;
    return await fetchAPI(endpoint);
}

async function consultar(tipo, categoria, rangoFechas, id = '') {
    const params = `categoria=${categoria}&rango_fechas=${rangoFechas}${id ? `&id_usuario=${id}` : ''}`;
    return await fetchAPI(`/v1/${tipo}/consultar?${params}`);
}

async function simular(tipo, cambio, categoria) {
    const body = tipo === 'personal' ? { cambio_gasto: cambio, categoria } : { cambio_costo: cambio, categoria };
    return await fetchAPI(`/v1/${tipo}/simular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
}

async function analizar(tipo, id) {
    const endpoint = `/v1/${tipo}/analizar?${tipo === 'personal' ? 'id_usuario' : 'empresa_id'}=${id}`;
    return await fetchAPI(endpoint);
}

async function comparar(tipo, categoria, periodo1, periodo2, id = '') {
    const params = `categoria=${categoria}&periodo1=${periodo1}&periodo2=${periodo2}${id ? `&empresa_id=${id}` : ''}`;
    return await fetchAPI(`/v1/${tipo}/comparar?${params}`);
}