const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');


const {
  obtenerLibros,
  crearLibro,
  actualizarLibro,
  eliminarLibro
} = require('../controllers/libros.controller');

router.get('/', auth, obtenerLibros);
router.post('/', auth, crearLibro);
router.put('/:id', auth, actualizarLibro);
router.delete('/:id', auth, eliminarLibro);

module.exports = router;