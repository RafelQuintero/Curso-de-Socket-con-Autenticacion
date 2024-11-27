const jwt = require('jsonwebtoken');

//IMportemos el modelo del usuario
const { Usuario } = require('../models'); //No sel coloca /usuario porque exite un index.js que lo contien

const generarJWT = (uid = '') => {
	return new Promise((resolve, reject) => {
		const payload = { uid };

		jwt.sign(
			payload,
			process.env.SECRETORPRIVATEKEY,
			{
				expiresIn: '4h',
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject('No se pudo generar el token');
				} else {
					resolve(token);
				}
			},
		);
	});
};

//Ahora solo debemos tomar el token anterior y validadrlo, no exite un metodo , pero solo quiero que me regrese el usuario que corresponde este  x-token. Por lo que crearemos un nuevo helpers o lo coloco en generar-jwt.js ya que tene que ver con JWT, creandonos una funcion
const comprobarJWT = async (token = '') => {
	try {
		if (token.length < 10) {
			return null; //regresa que no  exite un token válido
		}

		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

		//Como todo salio bien porque paso la instrucción anterior

		const usuario = await Usuario.findById(uid);
		if (usuario) {
			if (usuario.estado) {
				return usuario; //retorna un usuario porque este existe.
			} else {
				return null; //EL usuario no esta activo , regresando un null
			}
		} else {
			return null; //? No existe el usuario
		}
	} catch (error) {
		return null; //si la instruccion const{uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY), dá un error
	}
};

module.exports = {
	generarJWT,
	comprobarJWT,
};
