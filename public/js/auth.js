//* Si tuvieramos vario formulario (form) debemos obtenerlo con la siguiente instruccion document.querySelectorALL[i] donde i es ,1,2,3,4. etc , ya que estan dentro due un array de objetos que son los formularios.

//todo: nuevo escrito que es el scripy correspondiente al formulario de login manual
//Seleccionamos el formulario por su id qu es el identificador

const miformulario = document.querySelector('#miFormulario');
//Añado un evento de escucha al envio del formulario

miformulario.addEventListener('submit', (event) => {
	//Previene el comportamiento del formulario (recargar la agina web)
	event.preventDefault();

	//Creamos una constante llamda fonData  que contendara los obketo que contiene miFormulario (coorreo y pasword que es la que queremos mandarle al servidor
	const formData = {};

	//Leereomso todos los campos que estan en mi formulario y los guardare en la constante llada formData

	for (let leo of miformulario.elements) {
		if ((leo.name, length > 0))
			// Con la condicion estoy diciendo que no lo contiene ya que nunca sera mayor que cero
			//Por la que se creará la data enviada en el corro y en el password ya que el noton no contine el name,
			formData[leo.name] = leo.value;
	}
	//esta el la data que tengo qu mandarle al backen , como eso es correcto porque se ve que lo esta enviado , puedo elminar la instruccionde abaja; haciendola comentario
	//console.log('formulario enviado:', formData);

	//? Ahora haermos una peticon fetch, para poder acceder a lo que a enviado.
	fetch('http://localhost:8080/api/auth/login', {
		method: 'POST',
		body: JSON.stringify(formData),

		headers: {
			'Content-type': 'application/json',
		},
	})
		.then((resp) => resp.json())
		.then(({ msg, token }) => {
			//Extraigamos el mensaje y el toke de la data ta que la viomo cuabdo se ejcuto el console.log(data);
			if (msg) {
				//Si hay un error enviado por el msg  devolvemos el msg y nos salimos del togram
				return console.log(msg);
			}

			//Si todo sale bien mando al baken el tok
			localStorage.setItem('token', token);

			//Aqui redireccinamos  al chat cuando accedemos con la cuenta de google para poder acceder
			window.location = 'chat.html'; //todo: Se hace  redireccion 'chat.html'
		})
		.catch((err) => {
			consloe.log(err);
		});
});

//todo: fin de lo nuevo escrito

//?  EL CODIGO QUE ESTAN ABAJO ES PARA CREAR EL BOTON DE GOOLGE PARA VERIFICAR LAS CREDELCIALES DEL USUARIO
function handleCredentialResponse(response) {
	//* ESTE ES EL Google Token : o  Tambien conocido con ID_TOKEN
	//console.log('id_token', response.credential);

	const body = { id_token: response.credential };

	fetch('http://localhost:8080/api/auth/google', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},

		body: JSON.stringify(body),
	})
		.then((resp) => resp.json())
		.then(({ token }) => {
			//todo: De la repsuets del json se desectura para tomar el token
			//todo: No meustro esta instruccion console.log('NUESTRO SERVER', token); pero si pudo ver el tocque en
			localStorage.setItem('token', token); //todo; este es el valor del token que se va a grabar en el BACKEN por medio del localStorage.setItem('token', token)

			window.location = 'chat.html'; //todo: Se hace  redireccion 'chat.html'
		})

		.catch(console.warn);
}

//todo------------------------------------------

//todo________________________________________
