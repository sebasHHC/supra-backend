const express = require('express');
const router = express.Router();
const { obtenerEstudiantes } = require('../controllers/usuarios.controller');

// Ruta: GET /api/estudiantes
router.get('/estudiantes', obtenerEstudiantes);

module.exports = router;