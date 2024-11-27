const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
	const { correo, password } = req.body;

	try {
		// Verificar si el email existe
		const usuario = await Usuario.findOne({ correo });
		if (!usuario) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - correo',
			});
		}

		// SI el usuario está activo
		if (!usuario.estado) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - estado: false',
			});
		}

		// Verificar la contraseña
		const validPassword = bcryptjs.compareSync(password, usuario.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - password',
			});
		}

		// Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Hable con el administrador',
		});
	}
};

const googleSignin = async (req, res = response) => {
	const { id_token } = req.body; //* Tomare el id_token que viene de la request (peticion ) del body

	try {
		const { correo, nombre, img } = await googleVerify(id_token);

		let usuario = await Usuario.findOne({ correo });

		if (!usuario) {
			// Tengo que crearlo
			const data = {
				nombre,
				correo,
				password: ':P',
				img,
				google: true,
			};

			usuario = new Usuario(data);
			await usuario.save();
		}

		// Si el usuario en DB
		if (!usuario.estado) {
			return res.status(401).json({
				msg: 'Hable con el administrador, usuario bloqueado',
			});
		}

		// Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		res.status(400).json({
			msg: 'Token de Google no es válido',
		});
	}
};

//Creamos renovarToken para lautenticación
const renovarToken = async (req, res = response) => {
	//Yo se se que tengo  el id g  y su  usuario, y se que esto vene de la reaust
	const { usuario } = req; // Tambien lo puedo dejar solo como req.usuario
	// debebos  Generar el JWT nuevo
	const token = await generarJWT(usuario.id);

	res.json({ usuario, token });
};
//Ahora debo validar el token que se renovo en la pantalla del localhost/80880/ chat.html

module.exports = {
	login,
	googleSignin,
	renovarToken,
};
