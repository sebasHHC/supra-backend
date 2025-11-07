const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // ✅ Carga las variables desde .env

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB usando la variable de entorno
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/libros', require('./routes/libros.routes'));
app.use('/api/prestamos', require('./routes/prestamos.routes')); // ✅ ESTA ES LA CLAVE

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});