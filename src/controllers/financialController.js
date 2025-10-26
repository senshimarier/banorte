const { loadFinancialData, loadDataById, loadDataByCategory, loadDataByDateRange } = require('../utils/dataLoader');
const { projectPersonal, projectEmpresa, simulatePersonal, simulateEmpresa, analyzePersonal, analyzeEmpresa, comparePersonal, compareEmpresa } = require('../services/calculationService');

exports.proyectarPersonal = async (req, res) => {
  const { meses, id_usuario } = req.query;
  const data = await loadFinancialData('personales');
  const result = projectPersonal(data, parseInt(meses), id_usuario);
  res.json(result);
};

exports.consultarPersonal = async (req, res) => {
  const { categoria, rango_fechas, id_usuario } = req.query;  // Agregado id_usuario opcional
  const [start, end] = rango_fechas.split('-');
  let data = await loadDataByDateRange('personales', start, end);
  if (id_usuario) {
    data = data.filter(row => row.id === id_usuario);  // Filtra por ID si se proporciona
  }
  const total = data.filter(row => row.categoria === categoria).reduce((sum, row) => sum + row.monto, 0);
  const recomendacion = total > 2000 ? `Estás 10% por encima de tu meta. Considera reducir las suscripciones.` : `Buen control en esta categoría.`;
  res.json({ consulta: `Total en "${categoria}": ${total}`, recomendacion });
};

exports.simularPersonal = async (req, res) => {
  const { cambio_gasto, categoria } = req.body;  // Asegúrate de que Postman envíe body JSON
  const data = await loadFinancialData('personales');
  const result = simulatePersonal(data, parseFloat(cambio_gasto), categoria);
  res.json(result);
};

exports.analizarPersonal = async (req, res) => {
  const { id_usuario } = req.query;
  const data = await loadFinancialData('personales');
  const result = analyzePersonal(data, id_usuario);
  res.json(result);
};

exports.compararPersonal = async (req, res) => {
  const { categoria, periodo1, periodo2 } = req.query;
  const data = await loadFinancialData('personales');
  const result = comparePersonal(data, categoria, periodo1, periodo2);
  res.json(result);
};

exports.proyectarEmpresarial = async (req, res) => {
  const { trimestres, empresa_id } = req.query;
  const data = await loadFinancialData('empresa');
  const result = projectEmpresa(data, parseInt(trimestres), empresa_id);
  res.json(result);
};

exports.consultarEmpresarial = async (req, res) => {
  const { categoria, empresa_id } = req.query;
  const data = await loadDataById('empresa', empresa_id);
  const total = data.filter(row => row.categoria === categoria).reduce((sum, row) => sum + row.monto, 0);
  const recomendacion = `Realiza un análisis de eficiencia. La media del sector es del 35%.`;
  res.json({ consulta: `Costo en "${categoria}": ${total}`, recomendacion });
};

exports.simularEmpresarial = async (req, res) => {
  const { cambio_costo, categoria } = req.body;  // Asegúrate de que Postman envíe body JSON
  const data = await loadFinancialData('empresa');
  const result = simulateEmpresa(data, parseFloat(cambio_costo), categoria);
  res.json(result);
};

exports.analizarEmpresarial = async (req, res) => {
  const { empresa_id } = req.query;
  const data = await loadFinancialData('empresa');
  const result = analyzeEmpresa(data, empresa_id);
  res.json(result);
};

exports.compararEmpresarial = async (req, res) => {
  const { categoria, empresa_id } = req.query;
  const data = await loadFinancialData('empresa');
  const result = compareEmpresa(data, categoria, empresa_id);
  res.json(result);
};