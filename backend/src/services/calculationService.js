const math = require('mathjs');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAIRecommendation(context, action) {
  const prompt = `Eres un asesor financiero IA. Datos: ${JSON.stringify(context)}. Acción: ${action}. Genera una recomendación adicional en español.`;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    return 'Recomendación IA no disponible.';
  }
}

async function projectPersonal(data, meses, id) {
  const userData = data.filter(row => row.id === id);
  const ingresos = userData.filter(row => row.tipo === 'ingreso').reduce((sum, row) => sum + row.monto, 0);
  const gastos = userData.filter(row => row.tipo === 'gasto').reduce((sum, row) => sum + row.monto, 0);
  const saldoActual = ingresos - gastos;
  const projection = Array.from({length: meses}, (_, i) => saldoActual * (1 + 0.05 * i));
  const recomendacion = saldoActual > 0 ? `Aumenta el ahorro en "Ahorro" en un 5% para alcanzar ${projection[meses-1] * 1.05}.` : `Reduce gastos en categorías altas para mejorar el saldo.`;
  const aiRec = await generateAIRecommendation(userData, `Proyección a ${meses} meses`);
  return { projection: projection[meses-1], recomendacion: recomendacion + ` | IA: ${aiRec}` };
}

async function projectEmpresa(data, trimestres, id) {
  const companyData = data.filter(row => row.id === id);
  const ventas = companyData.filter(row => row.tipo === 'ingreso').reduce((sum, row) => sum + row.monto, 0);
  const costos = companyData.filter(row => row.tipo === 'gasto').reduce((sum, row) => sum + row.monto, 0);
  const ebitda = ventas - costos;
  const projection = Array.from({length: trimestres}, (_, i) => ebitda * (1 + 0.1 * i));
  const recomendacion = `Si aumentas la inversión en "ventas" en un 10%, el EBITDA podría subir a ${projection[trimestres-1] * 1.1}.`;
  const aiRec = await generateAIRecommendation(companyData, `Proyección EBITDA a ${trimestres} trimestres`);
  return { projection: projection[trimestres-1], recomendacion: recomendacion + ` | IA: ${aiRec}` };
}

async function simulatePersonal(data, cambioGasto, categoria) {
  const totalGastoCategoria = data.filter(row => row.categoria === categoria && row.tipo === 'gasto').reduce((sum, row) => sum + row.monto, 0);
  const nuevoGasto = totalGastoCategoria - cambioGasto;
  const excedenteAnual = cambioGasto * 12;
  const recomendacion = `Utiliza ese excedente para invertir en "Educación" o reducir una deuda.`;
  const context = data.filter(row => row.categoria === categoria);
  const aiRec = await generateAIRecommendation(context, `Simulación de reducción en ${categoria}`);
  return { simulacion: `Excedente anual: ${excedenteAnual}`, recomendacion: recomendacion + ` | IA: ${aiRec}` };
}

async function simulateEmpresa(data, cambioCosto, categoria) {
  const totalCostoCategoria = data.filter(row => row.categoria === categoria && row.tipo === 'gasto').reduce((sum, row) => sum + row.monto, 0);
  const nuevoCosto = totalCostoCategoria - cambioCosto;
  const margenNetoMejora = (cambioCosto / totalCostoCategoria) * 100;
  const recomendacion = `Evalúa la migración a un esquema de home office parcial para capitalizar ese ${margenNetoMejora.toFixed(2)}% en I+D.`;
  const context = data.filter(row => row.categoria === categoria);
  const aiRec = await generateAIRecommendation(context, `Simulación de reducción en ${categoria}`);
  return { simulacion: `Margen neto aumenta en ${margenNetoMejora.toFixed(2)}%`, recomendacion: recomendacion + ` | IA: ${aiRec}` };
}

async function analyzePersonal(data, id) {
  const userData = data.filter(row => row.id === id);
  const transporteGasto = userData.filter(row => row.categoria === 'Transporte' && row.tipo === 'gasto').reduce((sum, row) => sum + row.monto, 0);
  const recomendacion = `Evalúa la opción de transporte público o la negociación de un nuevo seguro para reducir el gasto.`;
  const aiRec = await generateAIRecommendation(userData, `Análisis de gastos para ${id}`);
  return { analisis: `Gasto en "Transporte": ${transporteGasto}`, recomendacion: recomendacion + ` | IA: ${aiRec}` };
}

async function analyzeEmpresa(data, id) {
  const companyData = data.filter(row => row.id === id);
  const liquidez = companyData.filter(row => row.tipo === 'ingreso').reduce((sum, row) => sum + row.monto, 0) / companyData.filter(row => row.tipo === 'gasto').reduce((sum, row) => sum + row.monto, 0);
  const recomendacion = liquidez < 1 ? `Negocia con proveedores un plazo de pago de 60 días para mejorar la posición de caja.` : `Mantén la liquidez actual.`;
  const aiRec = await generateAIRecommendation(companyData, `Análisis de liquidez para ${id}`);
  return { analisis: `Ratio de Liquidez: ${liquidez.toFixed(2)}`, recomendacion: recomendacion + ` | IA: ${aiRec}` };
}

async function comparePersonal(data, categoria, periodo1, periodo2) {
  const dataP1 = data.filter(row => row.fecha.includes(periodo1) && row.categoria === categoria);
  const dataP2 = data.filter(row => row.fecha.includes(periodo2) && row.categoria === categoria);
  const gastoP1 = dataP1.reduce((sum, row) => sum + row.monto, 0);
  const gastoP2 = dataP2.reduce((sum, row) => sum + row.monto, 0);
  const recomendacion = `Enfócate en "${categoria}" que es volátil.`;
  const context = data.filter(row => row.categoria === categoria);
  const aiRec = await generateAIRecommendation(context, `Comparación de ${categoria} entre ${periodo1} y ${periodo2}`);
  return { comparacion: `Gasto en ${categoria}: ${periodo1}=${gastoP1}, ${periodo2}=${gastoP2}`, recomendacion: recomendacion + ` | IA: ${aiRec}` };
}

async function compareEmpresa(data, categoria, id) {
  const companyData = data.filter(row => row.id === id && row.categoria === categoria);
  const recomendacion = `Revisa la estructura de precios y evalúa si el costo de adquisición de clientes es sostenible.`;
  const aiRec = await generateAIRecommendation(companyData, `Comparación de ${categoria} para ${id}`);
  return { comparacion: `Costo en "${categoria}": ${companyData.reduce((sum, row) => sum + row.monto, 0)}`, recomendacion: recomendacion + ` | IA: ${aiRec}` };
}

module.exports = { projectPersonal, projectEmpresa, simulatePersonal, simulateEmpresa, analyzePersonal, analyzeEmpresa, comparePersonal, compareEmpresa };