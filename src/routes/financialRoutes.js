const express = require('express');
const {
  proyectarPersonal, consultarPersonal, simularPersonal, analizarPersonal, compararPersonal,
  proyectarEmpresarial, consultarEmpresarial, simularEmpresarial, analizarEmpresarial, compararEmpresarial
} = require('../controllers/financialController');
const router = express.Router();

// Personal
router.get('/v1/personal/proyectar', proyectarPersonal);
router.get('/v1/personal/consultar', consultarPersonal);
router.post('/v1/personal/simular', simularPersonal);
router.get('/v1/personal/analizar', analizarPersonal);
router.get('/v1/personal/comparar', compararPersonal);

// Empresarial
router.get('/v1/empresarial/proyectar', proyectarEmpresarial);
router.get('/v1/empresarial/consultar', consultarEmpresarial);
router.post('/v1/empresarial/simular', simularEmpresarial);
router.get('/v1/empresarial/analizar', analizarEmpresarial);
router.get('/v1/empresarial/comparar', compararEmpresarial);

module.exports = router;