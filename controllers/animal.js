import Animal from '../models/animals.js';
// Método de prueba del controlador animal rescatado
export const testAnimal = (req, res) => {
    return res.status(200).send({
      message: "Mensaje enviado desde el controlador de Animals de la  Fundacion de Animales"
    });
  };
  
  // Método Registro de Animales Rescatados
export const register = async (req, res) => {
  try {
    // Obtener los datos de la petición
    let params = req.body;
    console.log(params);

    // Validar los datos obtenidos (que los datos obligatorios existan)
    if(!params.name || !params.owner_name || !params.species || !params.gender ) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos por enviar para un registro exitoso y detallado del animal rescatado"
      });
    }

    // Crear el objeto del animal rescatado con los datos que validamos
    let animal_to_save = new Animal(params);
  
       

    // Control de animales rescatados duplicados
    const existingAnimal = await Animal.findOne({
      $and: [
        { name: animal_to_save.name.toLowerCase() },
        { species: animal_to_save.species.toLowerCase()},
        { gender: animal_to_save.gender.toLowerCase() },
        
      ]
    });

    // Validar el existingAnimal
    if (existingAnimal) {
      return res.status(409).send({
        status: "error",
        message: "¡El animal rescatado ya existe en la Base de Datos de la Fundacion!"
      });
    }
    // Guardar el animal rescatado en la base de datos
    await animal_to_save.save();

     // Devolver el animal rescatado registrado
     return res.status(201).json({
      status: "created",
      message: "Registro de animal rescatado exitoso en la Base de Datos de la Fundacion!",
      animal_to_save
    });

  } catch (error) {
      console.log("Error en el registro de animales rescatados: ", error);
      // Devolver mensaje de error
      return res.status(500).send({
      status: "error",
      message: "Error en el registro de animales rescatados!"
      });
    }
};
