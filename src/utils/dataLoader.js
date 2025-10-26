const csv = require('csv-parser');
const fs = require('fs');

function loadFinancialData(type = 'personales') {
  const filePath = type === 'empresa' 
    ? './data/finanzas_empresa.csv' 
    : './data/finanzas_personales.csv';
  
  const data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const ingresos = row.tipo === 'ingreso' ? parseFloat(row.monto) || 0 : 0;
        const gastos = row.tipo === 'gasto' ? parseFloat(row.monto) || 0 : 0;
        const id = type === 'empresa' ? row.empresa_id : row.id_usuario;
        data.push({
          id: id,
          fecha: row.fecha,
          tipo: row.tipo,
          categoria: row.categoria,
          descripcion: row.descripcion || row.concepto,
          monto: ingresos || gastos
        });
      })
      .on('end', () => {
        console.log(`Datos cargados desde ${filePath}: ${data.length} filas`);
        resolve(data);
      })
      .on('error', reject);
  });
}

function loadDataById(type = 'personales', id) {
  return loadFinancialData(type).then(data => data.filter(row => row.id === id));
}

function loadDataByCategory(type = 'personales', categoria) {
  return loadFinancialData(type).then(data => data.filter(row => row.categoria === categoria));
}

function loadDataByDateRange(type = 'personales', startDate, endDate) {
  return loadFinancialData(type).then(data => 
    data.filter(row => {
      const date = new Date(row.fecha);
      return date >= new Date(startDate) && date <= new Date(endDate);
    })
  );
}

module.exports = { loadFinancialData, loadDataById, loadDataByCategory, loadDataByDateRange };