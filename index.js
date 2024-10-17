// Importar dependencias (configurar en package.json)
import express from "express";
import connection from "./database/connection.js";
import cors from "cors";
import bodyParser from "body-parser";
import UserRoutes from "./routes/users.js";
import PublicationRoutes from "./routes/publications.js";
import FollowRoutes from "./routes/follows.js"
import AnimalRoutes from "./routes/animals.js"

// Mensaje de Bienvenida para verificare ejecutó la API de Node
console.log("API Node en ejecución");

// Usar la conexión a la Base de Datos
connection();

// Crear el servidor Node
const app = express();
const puerto = process.env.PORT || 3900;

// Configurar cors para que acepte peticiones del frontend
app.use(cors({
  origin: '*',  //acepta solicitudes desde cualquier IP 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false, //Antes de aceptar una peticion valida que sea de una persona o no un BOT  
  optionsSuccessStatus: 204  //Especificar codigo de status exitosos 
}));

// Decodificar los datos desde los formularios para convertirlos en objetos de JavaScript
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  //Enviarle opciones a las peticiones 

// Configurar rutas del aplicativo (módulos)
app.use('/api/user', UserRoutes);   //Login, Registrarse
app.use('/api/publication', PublicationRoutes);   
app.use('/api/follow', FollowRoutes);
app.use('/api/animal', AnimalRoutes);

// Configurar el servidor de Node
app.listen(puerto, () => {
  console.log("Servidor de Node ejecutándose en el puerto", puerto);
});

export default app;


