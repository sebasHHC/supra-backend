const { Schema, model } = require('mongoose');

const libroSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  autor: {
    type: String,
    required: true,
    trim: true
  },
  genero: {
    type: String,
    required: true,
    trim: true
  },
  anio: {
    type: Number,
    required: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = model('Libro', libroSchema);