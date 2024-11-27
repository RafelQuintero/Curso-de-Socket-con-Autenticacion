//Pasos para ver los mnsajes y quienes estan conectados, lo haremos por medio de una clase

//?Se creara una nueva instancia para manejar  los mensaje llamada

class Mensaje {
	constructor(uid, nombre, mensaje) {
		//Creamos la propidadses
		this.uid = uid;
		this.nombre = nombre;
		this.mensaje = mensaje;
	}
}

class ChatMensajes {
	constructor() {
		this.mensajes = []; //ls mensajes se manejaran como un arreglo

		this.usuarios = {}; //Ls usuarios lo anejaremos con  objetos ej, {{ 'udi del ususrio': {apunto al iusuario rspectivo}     }, {}, {}, etc,....         }
	}

	//?creo los metodos respectivo para manejarlo de manera controlada
	get ultimos10() {
		this.mensajes = this.mensajes.splice(0, 10); //  Se guardan los utimos 10 mesnates  en el array mensasje
		return this.mensajes; //se mostraran los utimos 10 mesajes
	}

	//Ahora debemos regresar todos los usuarion como un arreglo ya que los tengo como un objetos por lo que crearemso la funcion para hacerlo que tomar todos los ususrios y loconvierte en en un arreglor de objetos
	get usuariosArr() {
		return Object.values(this.usuarios); //Aqui ya estoooy retornado todos los usuarios dentro de un arreglo. eje : [{usuari1}, {usuario2}, {usuario3}, {etc.}] : Yestos seran los ususrio que estan conectados
	}

	//?Ahora debe geenrar el método  enviarMensaje( uid, nombre,mensaje) para enviar un mensaje, cuyo parametro sera el uid,  el nombre de  usuario que envio el ensaje y el mensaje que el quiere enviar la cual se agregará a  this.mensaje

	enviarMensaje(uid, nombre, mensaje) {
		// el ultimo mensaje quiero insertarlo al inicio y estos seran almacenado

		this.mensajes.unshift(
			//cREAMOS UNA NUNEA INSTAnCIA MANDANDOLE EL uid, el nombre y el mensaje guardado this.mensajes = []
			new Mensaje(uid, nombre, mensaje),
		);
	}

	//Haremos un etodo para agregar un usuario

	conectarUsuario(usuario) {
		//el usuarios es del tipo objeto debemos recibirlo el usuario como tal, es decir guardaralo  como un objeto :
		this.usuarios[usuario.id] = usuario;
	}

	//? Método desconectar un usuario
	deconectarUsuario(id) {
		//utilzo la propiedad delete para borrar un objeto
		delete this.usuarios[id];
	}
}
//*ahora exportemoslo .recuerde siempre escribirlo siempre antesde crear cualquier  clase

module.exports = ChatMensajes; // Sol exprotamos este , porque la clase Mensaje solos funciona dentro de la clase ChatMensajesm ya que es una clase privada
