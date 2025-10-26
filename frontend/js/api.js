// frontend/js/api.js
const API_BASE_URL = 'http://localhost:5000/api/v1';

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Error en la API');
        return await response.json();
    } catch (error) {
        console.error('Error en fetchAPI:', error);
        throw error;
    }
}

// PROYECCIONES
async function proyectar(tipo, periodos, id) {
    if (tipo === 'personal') {
        return await fetchAPI(`/personal/proyectar?meses=${periodos}&usuario_id=${id}`);
    } else {
        return await fetchAPI(`/empresa/proyectar?trimestres=${periodos}&empresa_id=${id}`);
    }
}

// SIMULACIONES
async function simular(tipo, cambio, categoria) {
    if (tipo === 'personal') {
        return await fetchAPI(`/personal/simular?cambio=${cambio}&categoria=${categoria}`);
    } else {
        return await fetchAPI(`/empresa/simular?cambio=${cambio}&categoria=${categoria}`);
    }
}

// ANÁLISIS
async function analizar(tipo, id) {
    if (tipo === 'personal') {
        return await fetchAPI(`/personal/analizar?usuario_id=${id}`);
    } else {
        return await fetchAPI(`/empresa/analizar?empresa_id=${id}`);
    }
}

// COMPARAR
async function comparar(tipo, categoria, periodo1, periodo2, id) {
    if (tipo === 'personal') {
        return await fetchAPI(`/personal/comparar?categoria=${categoria}&periodo1=${periodo1}&periodo2=${periodo2}`);
    } else {
        return await fetchAPI(`/empresa/comparar?categoria=${categoria}&periodo1=${periodo1}&periodo2=${periodo2}&empresa_id=${id || ''}`);
    }
}

// CONSULTAR
async function consultar(tipo, categoria, rangoFechas, id) {
    const [fechaInicio, fechaFin] = rangoFechas.split('-');
    if (tipo === 'personal') {
        return await fetchAPI(`/personal/consultar?categoria=${categoria}&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&usuario_id=${id || ''}`);
    } else {
        return await fetchAPI(`/empresa/consultar?categoria=${categoria}&fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}&empresa_id=${id || ''}`);
    }
}
