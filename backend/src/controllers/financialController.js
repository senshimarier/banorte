const { loadFinancialData, loadDataById, loadDataByCategory, loadDataByDateRange } = require('../utils/dataLoader');
const { projectPersonal, projectEmpresa, simulatePersonal, simulateEmpresa, analyzePersonal, analyzeEmpresa, comparePersonal, compareEmpresa } = require('../services/calculationService');

exports.proyectarPersonal = async (req, res) => {
  const { meses, id_usuario } = req.query;
  const data = await loadFinancialData('personales');
  const result = await projectPersonal(data, parseInt(meses), id_usuario);
  res.json(result);
};

exports.consultarPersonal = async (req, res) => {
  const { categoria, rango_fechas, id_usuario } = req.query;
  const [start, end] = rango_fechas.split('-');
  let data = await loadDataByDateRange('personales', start, end);
  if (id_usuario) {
    data = data.filter(row => row.id === id_usuario);
  }
  const total = data.filter(row => row.categoria === categoria).reduce((sum, row) => sum + row.monto, 0);
  // Recomendación dinámica basada en datos
  const allData = await loadFinancialData('personales');
  const avgCategoria = allData.filter(row => row.categoria === categoria).reduce((sum, row) => sum + row.monto, 0) / allData.length;
  const recomendacion = total > avgCategoria * 1.1 ? `Estás 10% por encima del promedio. Considera reducir gastos.` : `Buen control en esta categoría.`;
  res.json({ consulta: `Total en "${categoria}": ${total}`, recomendacion });
};

exports.simularPersonal = async (req, res) => {
  const { cambio_gasto, categoria } = req.body;
  const data = await loadFinancialData('personales');
  const result = await simulatePersonal(data, parseFloat(cambio_gasto), categoria);
  res.json(result);
};

exports.analizarPersonal = async (req, res) => {
  const { id_usuario } = req.query;
  const data = await loadFinancialData('personales');
  const result = await analyzePersonal(data, id_usuario);
  res.json(result);
};

exports.compararPersonal = async (req, res) => {
  const { categoria, periodo1, periodo2 } = req.query;
  const data = await loadFinancialData('personales');
  const result = await comparePersonal(data, categoria, periodo1, periodo2);
  res.json(result);
};

exports.proyectarEmpresarial = async (req, res) => {
  const { trimestres, empresa_id } = req.query;
  const data = await loadFinancialData('empresa');
  const result = await projectEmpresa(data, parseInt(trimestres), empresa_id);
  res.json(result);
};

exports.consultarEmpresarial = async (req, res) => {
  const { categoria, empresa_id } = req.query;
  const data = await loadDataById('empresa', empresa_id);
  const total = data.filter(row => row.categoria === categoria).reduce((sum, row) => sum + row.monto, 0);
  // Recomendación dinámica
  const allData = await loadFinancialData('empresa');
  const avgCategoria = allData.filter(row => row.categoria === categoria).reduce((sum, row) => sum + row.monto, 0) / allData.length;
  const recomendacion = total > avgCategoria * 1.1 ? `Realiza un análisis de eficiencia. La media del sector es del 35%.` : `Costo controlado.`;
  res.json({ consulta: `Costo en "${categoria}": ${total}`, recomendacion });
};

exports.simularEmpresarial = async (req, res) => {
  const { cambio_costo, categoria } = req.body;
  const data = await loadFinancialData('empresa');
  const result = await simulateEmpresa(data, parseFloat(cambio_costo), categoria);
  res.json(result);
};

exports.analizarEmpresarial = async (req, res) => {
  const { empresa_id } = req.query;
  const data = await loadFinancialData('empresa');
  const result = await analyzeEmpresa(data, empresa_id);
  res.json(result);
};

exports.compararEmpresarial = async (req, res) => {
  const { categoria, empresa_id } = req.query;
  const data = await loadFinancialData('empresa');
  const result = await compareEmpresa(data, categoria, empresa_id);
  res.json(result);
};