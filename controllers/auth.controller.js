const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'Usuario ya existe' });

    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({ nombre, email, contraseña: hash, rol });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado' });
  } catch (err) {
    console.error('❌ Error en el registro:', err);
    res.status(500).json({ mensaje: 'Error en el registro' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!valido) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    // ✅ Generar token con el campo "id"
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ✅ Incluir el ID en la respuesta del usuario
    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (err) {
    console.error('❌ Error en el login:', err);
    res.status(500).json({ mensaje: 'Error en el login' });
  }
};