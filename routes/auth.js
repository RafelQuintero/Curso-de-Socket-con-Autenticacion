//? Aqui se definiran la rutas  y en cada una de ellls incluira los check que son la autienticaciones, asi como la validacionCampos.

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares'); //de aqui puedo extrare la informacion que necesito que es validarJWT

const { login, googleSignin, renovarToken } = require('../controllers/auth'); // improtemoslor enovarToken, despues de crearlo en el auth de loscontorladores

const router = Router();

router.post(
	'/login',
	[
		check('correo', 'El correo es obligatorio').isEmail(),
		check('password', 'La contraseña es obligatoria').not().isEmpty(), //* No tien que estar vacio ( .not().isEmpty() )
		validarCampos,
	],
	login,
);

router.post(
	'/google',
	[
		check('id_token', 'El id_token es necesario').not().isEmpty(), //* No tiene que estar vacio
		validarCampos,
	],
	googleSignin,
);

//Crearemos una ruta la cual estara dirigif¿da  a la ruta '/' cual necesito crear valdarJWT, por la posicon en el get se que es un middlware, ccon el tercer parametro del get coloco una funcion para lo que se debe hacer si el JWT es corrcto. llamado renovarToken a cual debemos crearla ya queno tenemos

router.get('/', validarJWT, renovarToken); //Ahora debo validar el token que se renovo en la pantalla del localhost/80880/ chat.html  y se ahce con esta instrucción

//en esta rur chequearemos la validacion

module.exports = router;
