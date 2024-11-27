const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

const { createServer } = require('http');

const { socketControler } = require('../sockets/controller');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = createServer(this.app); //* Crearemos la propieda server uitlizando pa propriedad this.app , Tabien se pude hacer esp en un sola lina  this.server =require('http').createServer( this.app );
		//* hams la propiedad de io que es niestro servidor de sockets
		this.io = require('socket.io')(this.server); //* tambien se puede hacer  io(this.server)

		this.paths = {
			auth: '/api/auth',
			buscar: '/api/buscar',
			categorias: '/api/categorias',
			productos: '/api/productos',
			usuarios: '/api/usuarios',
			uploads: '/api/uploads',
		};

		// Conectar a base de datos
		this.conectarDB();

		// Middlewares
		this.middlewares();

		// Rutas de mi aplicación
		this.routes();

		//todo: Hacemos el metoso para escuchar eventos de los sockets, por lo que crearemos un metodo que se llame
		this.sockets();
	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());

		// Directorio Público
		this.app.use(express.static('public'));

		// Fileupload - Carga de archivos
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: '/tmp/',
				createParentPath: true,
			}),
		);
	}

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth'));
		this.app.use(this.paths.buscar, require('../routes/buscar'));
		this.app.use(this.paths.categorias, require('../routes/categorias'));
		this.app.use(this.paths.productos, require('../routes/productos'));
		this.app.use(this.paths.usuarios, require('../routes/usuarios'));
		this.app.use(this.paths.uploads, require('../routes/uploads'));
	}

	//todo:  Crando el método  sockets

	sockets() {
		//aqui colocaremos toda la docunentacion para el manejo de los evento s, voy a la documetacion para tener informacion
		this.io.on('connection', (socket) => socketControler(socket, this.io));
	}

	listen() {
		//?Como estamos utilzando socket , para que escuche utilizamos el srver , ya que express no tien sockets ;por eso no utilizo el this.app.liste()
		this.server.listen(this.port, () => {
			console.log('Servidor corriendo en puerto', this.port);
		});
	}
}

module.exports = Server;
