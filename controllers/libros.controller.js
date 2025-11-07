const Libro = require('../models/libro.model');

// Obtener solo libros disponibles (para estudiantes)
exports.obtenerLibros = async (req, res) => {
  try {
    const libros = await Libro.find({ disponible: true });
    res.json(libros);
  } catch (error) {
    console.error('❌ Error al obtener libros:', error);
    res.status(500).json({ error: 'Error al obtener libros' });
  }
};

// Crear un nuevo libro (admin)
exports.crearLibro = async (req, res) => {
  try {
    const { titulo, autor, genero, anio, disponible, descripcion } = req.body;
    const nuevo = new Libro({ titulo, autor, genero, anio, disponible, descripcion });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('❌ Error al crear libro:', error);
    res.status(400).json({ error: 'Error al crear libro' });
  }
};

// Actualizar un libro existente (admin)
exports.actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Libro.findByIdAndUpdate(id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    console.error('❌ Error al actualizar libro:', error);
    res.status(400).json({ error: 'Error al actualizar libro' });
  }
};

// Eliminar un libro (admin)
exports.eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    await Libro.findByIdAndDelete(id);
    res.json({ mensaje: 'Libro eliminado' });
  } catch (error) {
    console.error('❌ Error al eliminar libro:', error);
    res.status(400).json({ error: 'Error al eliminar libro' });
  }
};