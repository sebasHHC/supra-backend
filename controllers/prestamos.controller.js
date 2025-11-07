const Prestamo = require('../models/prestamo.model');
const Libro = require('../models/libro.model');
const Usuario = require('../models/usuario.model');

// Crear préstamo (solo admin)
exports.crearPrestamo = async (req, res) => {
  try {
    const { libro, usuario } = req.body;

    // Verificar rol
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado: solo el administrador puede crear préstamos' });
    }

    // Validar existencia de usuario y libro
    const estudiante = await Usuario.findById(usuario);
    const libroSeleccionado = await Libro.findById(libro);

    if (!estudiante || !libroSeleccionado) {
      return res.status(404).json({ mensaje: 'Usuario o libro no encontrado' });
    }

    if (!libroSeleccionado.disponible) {
      return res.status(400).json({ mensaje: 'El libro no está disponible para préstamo' });
    }

    // Crear el préstamo
    const nuevoPrestamo = new Prestamo({
      usuario,
      libro,
      fechaPrestamo: new Date(),
      estado: 'prestado'
    });

    await nuevoPrestamo.save();

    // Marcar libro como no disponible
    libroSeleccionado.disponible = false;
    await libroSeleccionado.save();

    res.status(201).json({ mensaje: 'Préstamo creado correctamente', prestamo: nuevoPrestamo });
  } catch (error) {
    console.error('❌ Error al crear préstamo:', error);
    res.status(500).json({ mensaje: 'Error interno al crear el préstamo' });
  }
};