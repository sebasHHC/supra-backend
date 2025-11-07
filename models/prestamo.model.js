const mongoose = require('mongoose');

const prestamoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  libro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Libro',
    required: true
  },
  fechaPrestamo: {
    type: Date,
    default: Date.now
  },
  fechaDevolucion: {
    type: Date
  },
  estado: {
    type: String,
    enum: ['prestado', 'devuelto'], // ✅ corregido: antes decía 'pendiente'
    default: 'prestado'             // ✅ corregido: antes decía 'pendiente'
  }
});

module.exports = mongoose.model('Prestamo', prestamoSchema);