//*Creamos la fincion socketControler

const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

//?Creamos una instancia de chatmensajes
const chatMensajes = new ChatMensajes();

const socketControler = async (socket = new Socket(), io) => {
	//? necesito el socket y tambien la io  como parametro, ya que el io es todo el servidor de socket
	//* Colcandoe esta codigo: socket = new Socket y  el visual studio me ayudar con  informacion del socket y cuando termine de secribir el codigo elimino new Socket
	//* Necesito toda la informacion; como : el nombre , correo, password, estado, si es de google ono ,pero eso ya  lo tengo implementado el jwt con el resrServer. Por lo que aqui solo tengo qu evaluar es el JWT, pero debo obtenrlo, por lo que aqui solo tengo que grabar solamnte  el token; por ser el unico para cada usuario y debo comprobar que venga correctamee validado.Entoces  solo necesito el id basado  en el socket (socket.id). Recurde que al abrir le index.html tengo toda la logica del "Google Sign.In":  y esta en el index.html de la carpeta public y lacolocaremos en una carpeta independien que llamremos archivo independiente.
	//todo: YA que se que funciona, porque me da informacon del cliente conectado, ya la puedo suprimeir la linea 10
	//!console.log('Clente conectado', socket.id);

	//todo: Voy hacer lo suguiente para ver lo que contiene y ahi observo que tengo el x-token para extrerlo ya que es lo unico que me interesa
	//console.log(socket); //todo: exteaigamos el xsoken
	//console.log(ocket.handshake.headers['x-token']); //todod-: Ahora recarguemos el navegador web   que en esto momento es cliente es RAFAEL QUINTERO y vemos que el terminal solo aparece el token que es la informacion que quiero ya que es de este cliente. Por lo que podemos decir que es aqui donde recibimos el token cuando el cliente se conecta.
	//Ahora solo debemos tomar el token anterior y validadrlo, no exite un metodo , pero solo quiero que me regrese el usuario que corresponde este  x-token. Por lo que crearemos un nuevo helpers o lo coloco en generar-jwt.js ya que tene que ver con JWT-  Ahora Podemos suprimer la linea 13 con un comentario.

	//const token = socket.handshake.headers['x-token']; //Ahoar solo tengo que comprobar ese token co la funcion siguiente.
	const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

	if (!usuario) {
		//si usuario no existe  retormaremos un mensaje, diciendo que se deconecto el socket del servidor ya que no es la perosna que me interesa

		return socket.disconnect();
	}
	console.log('Se conectó', usuario.nombre); //Aui esto dando la iformacion de quien se conecto

	//Antes de emitirlo debemos agregar usuario conectado

	chatMensajes.conectarUsuario(usuario);

	//? Despues de valdado el usuario debo emitir  a todos la gente del chat que estan concetada ,que  una  persona se incorporo al chat incluyndo al que se esta conectando
	io.emit('usuarios-activo', chatMensajes.usuariosArr);

	//Código para mandarle todos los mensajes a una persona
	socket.emit('recibir-mensajes', chatMensajes.ultimos10);

	//todo: Conectarlo a una sal especia para enviar un mensaje privado .. Recurde que se van a tener 3 salas una global, otra por el sockat.id y la ultima por el usuario.id
	socket.join(usuario.id);

	//?Debo limpiar usuario cuando el usuario se deconecta
	socket.on('disconnect', () => {
		chatMensajes.deconectarUsuario(usuario.id); //deconectaomos el usiario del chat
		//Pero debemos eviar de nuevo la lista de los ususrios que estan conctados
		io.emit('usuarios-activo', chatMensajes.usuariosArr);
	});
	//  Colocaré  que estamso escuchando de  enviar-mensaje
	socket.on('enviar-mensaje', ({ uid, mensaje }) => {
		if (uid) {
			//Viene el menaje privado ; el procedimeinto es:  el servidor recibe el mensaje y el a su vez lo envia a la persona qe se quiere enviar el nensaje  por mdio de su uid
			socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje }); //? El de ; es el usuario que le envia el mensaje , el mesaje proiamente dicho.
		} else {
			console.log({ uid, mensaje });
			console.log('Enviando mensaje al servidor'); //Ya no necesito ver el payload ya se que funciona la cua era el paramétro de la funcio, en el segundo parametro
			chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
			//Ahora recibimos el mensaje del usuario que estaá concetado mediant toket. Ahara en los socket que estan en chat.js
			//Ahora enviamos mensaje a todo el mundo. Queda mucho a su descripción porque se lo puedo enviar a una pesona
			io.emit('recibir-mensajes', chatMensajes.ultimos10);
		}
	});
};
module.exports = {
	socketControler,
};

// Ya vimos las perosnas que se conectan, Ahora debo mostrar todas las personas que se conectan  en el html.
