//antes de llanmar la conexion con neustro baken  por medio del const socket = io();debo validarJWT

//const url = 'http://localhost:8080/api/auth';

//crearemos  que todavia no existe
let usuario = null; //estaba refrncia va tener la informacion de el ususrio autenticado.
//creareno la conexion que tampoco todavia existe
let socket = null; //Esta referncia va tener la informacion del socket cuandoe ste conectado

//todo. Crearemos  las referncias que vamos a necesitar tomadadas del chta.html

const textUid = document.querySelector('#textUid');
const textMensaje = document.querySelector('#textMensaje');
const UlUsuarios = document.querySelector('#UlUsuarios');
const btnSalir = document.querySelector('#btnSalir');
const UlMensajes = document.querySelector('#UlMensajes');

//VAlidar el token de local storage que es donde esta almacenado

const validarJWT = async () => {
	//extarigamos el token
	const token = localStorage.getItem('token') || ''; //extaremos el token del localStorage y si no viene colocamos un sring vacio.

	//Ahora hagamos un validacion dicendo que si es menor o igual 10 letras, el token no sirve
	if (token.length <= 10) {
		// Me envia al index.html que es la página del Gooble-sign In
		window.locatiom = 'index.html';

		throw new Error('No hay token en el servidor');
	}

	//2do. paso es llmar el Api que se creo que es http://localhost:8080/api/aut y y en los header se mando el x-token por lo que haremos una petico fetch

	const resp = await fetch('http://localhost:8080/api/auth', {
		headers: { 'x-token': token },
	});

	const { usuario: userDB, token: tokenDB } = await resp.json();
	console.log({ userDB, tokenDB });

	// si necesitamoas saber informacion el usurio lo hago como
	usuario = userDB;

	//En este punto veo si quiero renovar el jwt;  con la siguinete insruccion

	localStorage.setItem('token', tokenDB);

	//Hasta aqui ya temeos validado el JWT y mantenemos el usuario en la pantalla http://localhost:8080/chat.html , si el JWT es valido
	usuario = userDB; //Con esta infromacion ya se el ususrio conectado
	//veamoslo en la pagina web cual es el ususrrio conectado
	document.title = usuario.nombre; // Es el obre que se le habia puesto

	//todo: al colocar const socket = io(); le esty diciendo al usurario que se conecte pero en el backen no se que usuario es, por louq no debo colocarlo aqui, por lo que crearemos una funcion conectarSocket(); que pueda cpumolir con este requisto
	await conectarSocket();
};

const conectarSocket = async () => {
	//todo:  La funcion de abajao tiene un caracteristica importante que hace la comunicacion con el backen server y en os parametrose esta le estoy madando el jJWT en la coneccion

	//Reutilizamos la variable que ya habias creado let socket = null
	socket = io({
		extraHeaders: {
			// todo: Aqui le madamos  al io lo que nosotros queramos la conexion qu estamos hacien aqui va a caer en nuetro controlador de nuestro sockets
			'x-token': localStorage.getItem('token'),
		},
	});

	//Ahora crearemos los eventos cunado el socket de la iinea 61 se active

	//Eveto de socket conecatado
	socket.on('connect', () => {
		console.log('Sockets online');
	});
	//Eveto de socket desconecatado
	socket.on('disconnect', () => {
		console.log('Sockets offLine');
	});

	//Mensajes que le voy a emitir al servidor es decir aqui recibe el mensaje el servdor
	socket.on('recibir-mensajes', dibujarMensajes);
	//TODO: Definino que mensajes se  está  enviando al chat como segundo parametro.

	//Mensaeje que se debe estan escuchando de los usuarios activos

	socket.on('mensaje-privado', (payload) => {
		//TODO: Definimo el  usuario esta conectados en el chat pero esta mandando un mensaje privado solo al la persona que se quiere enviar el mendaje
		console.log('Privado:', payload);
	});

	socket.on('usuarios-activo', dibujarUsuarios);
	//TODO: Definino que usuarios estan conectados en el chat que es con el segundo parametro. El segundo parametro sera sustituido  por la  la funcion dibujarUsuarios ya qye es el que recibira los usuariosconectados  contienido en  el payload, "(payload)=>{console.log(payload)};" }

	socket.on('usuarios-privado', () => {
		//TODO: Definimoque usuarios estan conectados en el chat de manera privada, solo lo va a ver el usuari que lo recibió
	});
};

//Aque empesare a crea el codigo para que los usuarios se muestren en el html
const dibujarUsuarios = (usuarios = []) => {
	//1.- Utilizare un arreglo vacio llamada usuario= [], para que visual studio pueda  visualizar los métodos y funciones de los arreglos
	//2.- Construiremos un html
	let userHtml = '';

	usuarios.forEach(({ nombre, uid }) => {
		//el forEach es para recorren todos los ususrios contenidos en ulUsuarios, y crearemos un lista de usuario
		userHtml += `   

		<li>
			<p>
				<h5  class="text-success"> ${nombre} </h5>
				<span class="fs-6 text-muted">  ${uid} </span>


			</p>
			
		
		</li>


		
		`; //Estoy haciendo un tenple  string muktikinea  y dentro un pararfo
	});
	UlUsuarios.innerHTML = userHtml;
};

// Código para que los mensajes aparezacan el el chat.html, es lo mismo que la funcion dibujar mensajes

const dibujarMensajes = (mensajes = []) => {
	//1.- Utilizare un arreglo vacio llamada usuario= [], para que visual studio pueda  visualizar los métodos y funciones de los arreglos
	//2.- Construiremos un html
	let mensajesHtml = '';

	mensajes.forEach(({ nombre, mensaje }) => {
		//el forEach es para recorren todos los ususrios contenidos en ulUsuarios, y crearemos un lista de usuario
		mensajesHtml += `   

		<li>
			<p>
				<span  class="text-primary"> ${nombre}: </span>
				<span >  ${mensaje} </span>


			</p>
			
		
		</li>


		
		`; //Estoy haciendo un tenple  string muktikinea  y dentro un pararfo
	});
	UlMensajes.innerHTML = mensajesHtml;
};

//Fide dibujar mensajes

//Agreguemos un addEventlisternet antes de enviar un mensaje

textMensaje.addEventListener('keyup', ({ keyCode }) => {
	//coprobemos para ver que vemos, haciendo el console.log() del evento
	//console.log(ev); ya  comprobamos

	//Quiero mandar el mesaje
	const mensaje = textMensaje.value;

	const uid = textUid.value;

	if (keyCode !== 13) {
		return;
	}

	if (mensaje.length === 0) {
		return;
	}

	//debo emitir el menaje y reurde crearlo en el controladosr
	socket.emit('enviar-mensaje', { mensaje, uid }); //Recuerde simpre mandar la informacion como un objeto; en est caso lo que contiene los txtbox son  el uid y el usuario.

	//Despues de eniar el mesaje se limpiara la cja de texto txtMensaje
	textMensaje.value = '';
});

const main = async () => {
	//Aqui quiero validar JWT

	await validarJWT();
};

main();

//* Ocuparemos la instanacia del io la cual la llamaremos en chat.hml que esta en la carpeta public

//todo: Debemos hacer la validacio de jwt contra es socket.io
//const socket = io();
