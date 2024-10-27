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
      
    //Control validacion del usuario que esta logueado que desea registrar el animal rescatado
    const identity = req.user; 
    console.log(identity.role);   ///rol del usuario logueado
     
    
    if (identity.role !== "role_user" ) {
      return res.status(409).send({
        status: "error",
        message: "¡No se tiene  el rol Admin para crear registro de Animales Rescatados!"
      });
    }else {
        
    /////Normalizacion de los Parametros
    params.name= params.name.toLowerCase();
    params.owner_name= params.owner_name.toLowerCase();
    params.species= params.species.toLowerCase();
    params.gender= params.gender.toLowerCase();
     console.log(params);

        // Validar los datos obtenidos (que los datos obligatorios existan)
    if(!params.name || !params.owner_name || !params.species || !params.gender ) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos por enviar para un registro exitoso  del animal rescatado"
      });
    }
            // Crear el objeto del animal rescatado con los datos que validamos
            let animal_to_save = new Animal(params);

            

    // Control de animales rescatados duplicados
    const existingAnimal = await Animal.findOne({
      $and: [
        { name: animal_to_save.name },  
        { species: animal_to_save.species },
        { gender: animal_to_save.gender },    
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

  }

  } catch (error) {
      console.log("Error en el registro de animales rescatados: ", error);
      // Devolver mensaje de error
      return res.status(500).send({
      status: "error",
      message: "Error en el registro de animales rescatados!"
      });
    }
};

/*
// Método para actualizar los datos de animales rescatados
export const updateAnimal = async (req, res) => {
  try {
    // Obtener los datos de la petición
    let paramsAnimalToUpdate = req.body;
      
    //Control validacion del usuario que esta logueado que desea registrar el animal rescatado
    let userIdentity = req.user; 
    console.log(userIdentity.role);   ///rol del usuario logueado  ****
     
    
    if (userIdentity.role !== "role_user" ) {
      return res.status(409).send({
        status: "error",
        message: "¡No se tiene  el rol Admin para editar registros de Animales Rescatados!"
      });

    else {  

    
     // Eliminar campos que sobran porque no los vamos a actualizar
    //delete paramsAnimalToUpdatee.iat;
    //delete paramsAnimalToUpdate.exp;
    //delete paramsAnimalToUpdate.role;

      // Validar los datos obtenidos del body (que los datos obligatorios existan)
      if(!paramsAnimalToUpdate.name || !paramsAnimalToUpdate.owner_name || !paramsAnimalToUpdate.species || !paramsAnimalToUpdate.gender ) {
        return res.status(400).json({
          status: "error",
          message: "Faltan datos por realizar la actualizacion exitosa  del animal rescatado"
        });
      }

      // Lista de campos a normalizar
      let fieldsToNormalize = ["name", "owner_name", "species", "gender"];

      // Recorrer los campos y aplicar toLowerCase
      for (let field of fieldsToNormalize) {
        if (paramsAnimalToUpdate[field]) { // Verificar si el campo existe en el objeto
        paramsAnimalToUpdate[field] = paramsAnimalToUpdate[field].toLowerCase();
        }
      }

      // Imprimir los campos normalizados
      console.log(paramsAnimalToUpdate);   ////*******IMPRIMIR CAMPOS 

    
    
    // Crear el objeto del animal rescatado con los datos que validamos
     let animal_to_update = new Animal(paramsAnimalToUpdate);

    // Comprobamos si el animal rescatado  ya existe en la BD
    const animals = await Animal.find({
      $and: [
        { name: animal_to_update.name },  
        { species: animal_to_update.species },
        { gender: animal_to_update.gender },    
      ]
    }).exec();

    // Verificar si el animal está duplicado para evitar conflictos
    const isDuplicateAnimal = animals.some(animal => {
      return animal && user._id.toString() !== userIdentity.userId;
    });

    if(isDuplicateAnimal) {
      return res.status(400).send({
        status: "error",
        message: "Error, solo se puede actualizar los datos de un   ....."
      });
    }

    
    // Buscar y actualizar el usuario en Mongo
    let userUpdated = await Animal.findByIdAndUpdate(animal._id.toString(),paramsAnimalToUpdateToUpdate, { new: true});

    if(!animalUpdated){
      return res.status(400).send({
        status: "error",
        message: "Error al actualizar el animal rescatado"
      });
    };

    // Devolver la respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "Animal rescactado actualizado correctamente",
      user: userUpdated
    });
   }
  } catch (error) {
    console.log("Error al actualizar los datos del animal rescatado: ", error);
    return res.status(500).send({
      status: "error",
      message: "Error al actualizar los datos del animal rescatado usuario"
    });
  }
};
*/