const Usuario = require('../models/usuario.model'); // Ajusta si tu modelo está en otra ruta

// GET /api/estudiantes
const obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Usuario.find({ rol: 'estudiante' });
    res.json(estudiantes);
  } catch (error) {
    console.error('❌ Error al obtener estudiantes:', error);
    res.status(500).json({ mensaje: 'Error al obtener estudiantes' });
  }
};

module.exports = {
  obtenerEstudiantes
};