// backend/src/routes/financialRoutes.js - CORREGIDO
const express = require('express');
const router = express.Router();
const {
  proyectarPersonal, 
  consultarPersonal, 
  simularPersonal, 
  analizarPersonal, 
  compararPersonal,
  proyectarEmpresarial, 
  consultarEmpresarial, 
  simularEmpresarial, 
  analizarEmpresarial, 
  compararEmpresarial
} = require('../controllers/financialController');

// ⭐ RUTAS PERSONALES (sin /v1 porque ya está en app.js)
router.get('/personal/proyectar', proyectarPersonal);
router.get('/personal/consultar', consultarPersonal);
router.post('/personal/simular', simularPersonal);
router.get('/personal/analizar', analizarPersonal);
router.get('/personal/comparar', compararPersonal);

// ⭐ RUTAS EMPRESARIALES (empresa, NO empresarial)
router.get('/empresa/proyectar', proyectarEmpresarial);
router.get('/empresa/consultar', consultarEmpresarial);
router.post('/empresa/simular', simularEmpresarial);
router.get('/empresa/analizar', analizarEmpresarial);
router.get('/empresa/comparar', compararEmpresarial);

module.exports = router;
