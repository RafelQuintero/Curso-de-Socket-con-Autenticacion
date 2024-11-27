const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token'); //Lo esta lelendo el token de 'x-token'

	if (!token) {
		return res.status(401).json({
			msg: 'No hay token en la petición',
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY); //Realiza la vrificacion del token y lo extrae

		// leer el usuario que corresponde al uid
		const usuario = await Usuario.findById(uid); //Ahora estableco el usuario de ese 'uid'

		if (!usuario) {
			return res.status(401).json({
				msg: 'Token no válido - usuario no existe DB',
			});
		}

		// Verificar si el uid tiene estado true
		if (!usuario.estado) {
			return res.status(401).json({
				msg: 'Token no válido - usuario con estado: false',
			});
		}

		req.usuario = usuario; //Aqui establecmos en la request el usurio y este es usuario realmente  validado
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: 'Token no válido',
		});
	}
};

module.exports = {
	validarJWT,
};
