const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const Prestamo = require('../models/prestamo.model');
const Libro = require('../models/libro.model');
const Usuario = require('../models/usuario.model');

// ✅ Obtener préstamos del usuario autenticado
router.get('/mios', authMiddleware, async (req, res) => {
  try {
    const prestamos = await Prestamo.find({ usuario: req.usuario.id }).populate('libro');
    res.json(prestamos);
  } catch (err) {
    console.error('❌ Error al obtener préstamos:', err);
    res.status(500).json({ mensaje: 'Error al obtener préstamos' });
  }
});

// ✅ Devolver un préstamo
router.put('/:id/devolver', authMiddleware, async (req, res) => {
  try {
    const prestamo = await Prestamo.findById(req.params.id);
    if (!prestamo) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });

    if (prestamo.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para devolver este préstamo' });
    }

    if (prestamo.estado === 'devuelto') {
      return res.status(400).json({ mensaje: 'Este préstamo ya fue devuelto' });
    }

    prestamo.estado = 'devuelto';
    prestamo.fechaDevolucion = new Date();
    await prestamo.save();

    await Libro.findByIdAndUpdate(prestamo.libro, { disponible: true });

    res.json({ mensaje: 'Libro devuelto correctamente' });
  } catch (err) {
    console.error('❌ Error al devolver préstamo:', err);
    res.status(500).json({ mensaje: 'Error al devolver el préstamo' });
  }
});

// ✅ Crear préstamo con fecha personalizada (solo admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Solo el administrador puede crear préstamos' });
    }

    const { libroId, usuarioId, fechaDevolucion } = req.body;

    if (!libroId || !usuarioId) {
      return res.status(400).json({ mensaje: 'Faltan datos: libroId y usuarioId son requeridos' });
    }

    const libro = await Libro.findById(libroId);
    const usuario = await Usuario.findById(usuarioId);

    if (!libro || !libro.disponible) {
      return res.status(404).json({ mensaje: 'Libro no disponible o no encontrado' });
    }

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const nuevoPrestamo = new Prestamo({
      usuario: usuarioId,
      libro: libroId,
      fechaPrestamo: new Date(),
      fechaDevolucion: fechaDevolucion ? new Date(fechaDevolucion) : null,
      estado: 'prestado'
    });

    await nuevoPrestamo.save();
    await Libro.findByIdAndUpdate(libroId, { disponible: false });

    res.status(201).json({ mensaje: 'Préstamo creado correctamente por el administrador' });
  } catch (err) {
    console.error('❌ Error al crear préstamo:', err);
    res.status(500).json({ mensaje: 'Error al crear el préstamo' });
  }
});

module.exports = router;