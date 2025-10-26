// backend/services/calculationService.js
const math = require('mathjs');

// Función para generar recomendaciones (intenta con Gemini, si falla usa recomendaciones básicas)
async function generateAIRecommendation(context, action) {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Si no hay API Key, usar recomendaciones básicas
    if (!apiKey) {
        console.warn('⚠️ GEMINI_API_KEY no configurada, usando recomendaciones básicas');
        return generarRecomendacionBasica(context, action);
    }

    // Lista de modelos de Gemini a probar
    const modelos = ['gemini-1.5-pro-latest', 'gemini-1.5-flash', 'gemini-pro'];
    const prompt = `Eres asesor financiero de Banorte México. ${action}. Contexto: ${JSON.stringify(context)}. Responde en español (máximo 100 palabras).`;

    // Intentar con cada modelo
    for (const modelo of modelos) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 250 }
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    console.log(`✅ IA activa con ${modelo}`);
                    return data.candidates[0].content.parts[0].text;
                }
            }
        } catch (error) {
            console.log(`❌ ${modelo} falló:`, error.message);
        }
    }
    
    // Si todos fallan, usar recomendaciones básicas
    console.log('⚠️ Usando recomendaciones predeterminadas');
    return generarRecomendacionBasica(context, action);
}

// Recomendaciones predeterminadas
function generarRecomendacionBasica(context, action) {
    const recs = {
        'proyección financiera personal': `Con tu saldo actual de $${(context.saldoActual || 0).toLocaleString('es-MX')}, proyectamos $${(context.saldoFinal || 0).toLocaleString('es-MX')} en ${context.meses || 0} meses. Mantén un fondo de emergencia de 3-6 meses de gastos y revisa tu presupuesto mensualmente.`,
        
        'proyección empresarial': `Proyección a ${context.trimestres || 0} trimestres: $${(context.saldoFinal || 0).toLocaleString('es-MX')}. Optimiza costos operativos y diversifica fuentes de ingreso.`,
        
        'simulación personal': `El cambio de $${context.cambio || 0} en "${context.categoria}" da un nuevo total de $${(context.nuevoTotal || 0).toLocaleString('es-MX')}. Implementa cambios gradualmente.`,
        
        'simulación empresarial': `Simulación en "${context.categoria}": nuevo total $${(context.nuevoTotal || 0).toLocaleString('es-MX')}. Evalúa impacto en otras áreas.`,
        
        'análisis personal': `Tasa de ahorro: ${context.tasaAhorro || 0}%. ${parseFloat(context.tasaAhorro || 0) > 20 ? 'Excelente gestión' : 'Considera reducir gastos no esenciales'}.`,
        
        'análisis empresarial': `Utilidad: $${(context.utilidad || 0).toLocaleString('es-MX')}. ${context.utilidad > 0 ? 'Margen positivo' : 'Revisa estructura de costos'}.`,
        
        'comparación personal': `Variación: ${context.diferencia > 0 ? 'incremento' : 'reducción'} de $${Math.abs(context.diferencia || 0).toLocaleString('es-MX')}. Ajusta presupuesto según tendencias.`,
        
        'comparación empresarial': `Variación: ${context.variacion >= 0 ? '+' : ''}$${(context.variacion || 0).toLocaleString('es-MX')}. Mantén monitoreo constante.`
    };
    return recs[action] || 'Mantén registro detallado de finanzas y revisa objetivos periódicamente.';
}

// PROYECCIONES
async function projectPersonal(data, meses, id) {
    const userData = data.filter(row => row.id == id);
    if (userData.length === 0) return { projection: 'No se encontraron datos', recomendacion: 'Verifica el ID' };
    
    const ingresos = userData.filter(r => r.tipo === 'ingreso').reduce((s, r) => s + r.monto, 0);
    const gastos = userData.filter(r => r.tipo === 'gasto').reduce((s, r) => s + r.monto, 0);
    const saldoActual = ingresos - gastos;
    const saldoFinal = saldoActual * Math.pow(1.02, parseInt(meses));
    
    return {
        projection: `Proyección ${meses} meses: Saldo estimado $${saldoFinal.toLocaleString('es-MX', {minimumFractionDigits: 2})}. Actual: $${saldoActual.toLocaleString('es-MX', {minimumFractionDigits: 2})}.`,
        recomendacion: await generateAIRecommendation({ saldoActual, saldoFinal, meses }, 'proyección financiera personal')
    };
}

async function projectEmpresa(data, trimestres, id) {
    const empresaData = data.filter(row => row.id == id);
    if (empresaData.length === 0) return { projection: 'No se encontraron datos', recomendacion: 'Verifica el ID' };
    
    const ingresos = empresaData.filter(r => r.tipo === 'ingreso').reduce((s, r) => s + r.monto, 0);
    const gastos = empresaData.filter(r => r.tipo === 'gasto').reduce((s, r) => s + r.monto, 0);
    const saldoActual = ingresos - gastos;
    const saldoFinal = saldoActual * Math.pow(1.05, parseInt(trimestres));
    
    return {
        projection: `Proyección ${trimestres} trimestres: $${saldoFinal.toLocaleString('es-MX', {minimumFractionDigits: 2})}`,
        recomendacion: await generateAIRecommendation({ saldoActual, saldoFinal, trimestres }, 'proyección empresarial')
    };
}

// SIMULACIONES
async function simulatePersonal(data, cambio, categoria) {
    const total = data.filter(r => r.categoria === categoria).reduce((s, r) => s + r.monto, 0);
    const nuevoTotal = total + parseFloat(cambio);
    const pct = total !== 0 ? ((nuevoTotal - total) / total * 100).toFixed(2) : 0;
    
    return {
        simulacion: `"${categoria}": Actual $${total.toLocaleString('es-MX', {minimumFractionDigits: 2})}, Nuevo $${nuevoTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})} (${pct > 0 ? '+' : ''}${pct}%)`,
        recomendacion: await generateAIRecommendation({ categoria, total, nuevoTotal, cambio }, 'simulación personal')
    };
}

async function simulateEmpresa(data, cambio, categoria) {
    const total = data.filter(r => r.categoria === categoria).reduce((s, r) => s + r.monto, 0);
    const nuevoTotal = total + parseFloat(cambio);
    
    return {
        simulacion: `"${categoria}": Nuevo total $${nuevoTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}`,
        recomendacion: await generateAIRecommendation({ categoria, total, nuevoTotal }, 'simulación empresarial')
    };
}

// ANÁLISIS
async function analyzePersonal(data, id) {
    const userData = data.filter(row => row.id == id);
    if (userData.length === 0) return { analisis: 'Sin datos', recomendacion: 'Verifica el ID' };
    
    const ingresos = userData.filter(r => r.tipo === 'ingreso').reduce((s, r) => s + r.monto, 0);
    const gastos = userData.filter(r => r.tipo === 'gasto').reduce((s, r) => s + r.monto, 0);
    const balance = ingresos - gastos;
    const tasaAhorro = ingresos > 0 ? ((balance / ingresos) * 100).toFixed(2) : 0;
    
    return {
        analisis: `ID ${id}: Ingresos $${ingresos.toLocaleString('es-MX', {minimumFractionDigits: 2})}, Gastos $${gastos.toLocaleString('es-MX', {minimumFractionDigits: 2})}, Balance $${balance.toLocaleString('es-MX', {minimumFractionDigits: 2})}. Ahorro: ${tasaAhorro}%.`,
        recomendacion: await generateAIRecommendation({ id, ingresos, gastos, balance, tasaAhorro }, 'análisis personal')
    };
}

async function analyzeEmpresa(data, id) {
    const empresaData = data.filter(row => row.id == id);
    if (empresaData.length === 0) return { analisis: 'Sin datos', recomendacion: 'Verifica el ID' };
    
    const ingresos = empresaData.filter(r => r.tipo === 'ingreso').reduce((s, r) => s + r.monto, 0);
    const gastos = empresaData.filter(r => r.tipo === 'gasto').reduce((s, r) => s + r.monto, 0);
    const utilidad = ingresos - gastos;
    
    return {
        analisis: `Empresa ${id}: Ingresos $${ingresos.toLocaleString('es-MX', {minimumFractionDigits: 2})}, Utilidad $${utilidad.toLocaleString('es-MX', {minimumFractionDigits: 2})}`,
        recomendacion: await generateAIRecommendation({ id, ingresos, gastos, utilidad }, 'análisis empresarial')
    };
}

// COMPARACIONES
async function comparePersonal(data, categoria, periodo1, periodo2) {
    const data1 = data.filter(r => r.fecha?.startsWith(periodo1) && r.categoria === categoria);
    const data2 = data.filter(r => r.fecha?.startsWith(periodo2) && r.categoria === categoria);
    
    const total1 = data1.reduce((s, r) => s + r.monto, 0);
    const total2 = data2.reduce((s, r) => s + r.monto, 0);
    const diferencia = total2 - total1;
    
    return {
        comparacion: `"${categoria}": ${periodo1} ($${total1.toLocaleString('es-MX', {minimumFractionDigits: 2})}) vs ${periodo2} ($${total2.toLocaleString('es-MX', {minimumFractionDigits: 2})}). Dif: ${diferencia >= 0 ? '+' : ''}$${diferencia.toLocaleString('es-MX', {minimumFractionDigits: 2})}.`,
        recomendacion: await generateAIRecommendation({ categoria, periodo1, periodo2, total1, total2, diferencia }, 'comparación personal')
    };
}

async function compareEmpresa(data, categoria, periodo1, periodo2, id) {
    const data1 = data.filter(r => r.fecha?.startsWith(periodo1) && r.categoria === categoria && (!id || r.id == id));
    const data2 = data.filter(r => r.fecha?.startsWith(periodo2) && r.categoria === categoria && (!id || r.id == id));
    
    const total1 = data1.reduce((s, r) => s + r.monto, 0);
    const total2 = data2.reduce((s, r) => s + r.monto, 0);
    const variacion = total2 - total1;
    
    return {
        comparacion: `"${categoria}": ${periodo1} vs ${periodo2}. Variación: ${variacion >= 0 ? '+' : ''}$${variacion.toLocaleString('es-MX', {minimumFractionDigits: 2})}`,
        recomendacion: await generateAIRecommendation({ categoria, periodo1, periodo2, total1, total2, variacion }, 'comparación empresarial')
    };
}

module.exports = {
    projectPersonal,
    projectEmpresa,
    simulatePersonal,
    simulateEmpresa,
    analyzePersonal,
    analyzeEmpresa,
    comparePersonal,
    compareEmpresa
};
