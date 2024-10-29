import Animal from '../models/animals.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";

// Configurar el dotenv para usar variables de entorno
dotenv.config();

// Método de prueba del controlador animal rescatado
export const testAnimal = (req, res) => {
      return res.status(200).send({
      message: "Mensaje enviado desde el controlador de Animales de la  Fundacion de Animales"
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
     
    
    if (identity.role !== "role_administratorf" ) {
      return res.status(409).send({
        status: "error",
        message: "¡No se tiene  el rol Admin para crear registro de Animales Rescatados!"
      });
    }
        
           // Validar los datos obtenidos (que los datos obligatorios existan)
    if(!params.name || !params.owner_name || !params.species || !params.gender ) {
      return res.status(400).json({
        status: "error",
        message: "Faltan algun dato de los siguientes por diligenciar para un registro exitoso  del animal rescatado (Name, Propietario, Especie, Genero) "
      });
    }
   
    /////Normalizacion de los Parametros
    params.name= params.name.toLowerCase();
    params.owner_name= params.owner_name.toLowerCase();
    params.species= params.species.toLowerCase();
    params.gender= params.gender.toLowerCase();
     console.log(params);

    // Crear el objeto del animal rescatado con los datos que validamos
    let animal_to_save = new Animal(params);
    //console.log("impresion objeto " + animal_to_save + " con los valores del body");
     
    // Agregar al objeto de Animal la información del usuario autenticado quien crea el registro del animal rescatado
     console.log("Datos del usuario registrado " + req.user.userId)
     animal_to_save.user_id = req.user.userId;   
     console.log("Impresion del objeto animal_to_save con los nuevos valores del UserId " + animal_to_save);

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

  
  } catch (error) {
      console.log("Error en el registro de animales rescatados: ", error);
      // Devolver mensaje de error
      return res.status(500).send({
      status: "error",
      message: "Error en el registro de animales rescatados!"
      });
    }
};

// Método para mostrar la publicación
export const showRescuedAnimal = async (req, res) => {
  try {
    // Obtener el ID del Animal rescatado desde la url (parámetros)
    const rescuedAnimalId = req.params.id;

    // Buscar el Animal rescatado en la BD por ID
    const rescuedAnimalStored = await Animal.findById(rescuedAnimalId).populate('user_id', 'name last_name');

    // Verificar si existe Animal rescatado en la BD
    if(!rescuedAnimalStored){
      return res.status(404).send({
        status: "error",
        message: "No existe registro de ese Animal rescatado "
      });
    }

    // Devolvemos respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "Registro de Animal rescatado encontrado",
      publication: rescuedAnimalStored
    });

  } catch (error) {
    console.log(`Error al mostrar el registro del animal rescatado: ${ error }`);
    return res.status(500).send({
      status: "error",
      message: "Error al mostrar el registro del animal rescatado"
    });
  }
};

// Método para eliminar un registro de animal rescatado 
export const deleteRescuedAnimal = async (req, res) => {
  try {

    // Obtener el ID del Animal rescatado desde la url (parámetros)
    const rescuedAnimalId = req.params.id;

     //Control validacion del role del usuario que esta logueado que desea eliminar  el Animal rescatado
     const identity = req.user; 
     console.log(identity.role);   ///rol del usuario logueado
      
     
     if (identity.role !== "role_administratorf" ) {
       return res.status(409).send({
         status: "error",
         message: "¡No se tiene  el rol Admin para eliminar registro de Animales Rescatados!"
       });
     }


    // Buscar el registro del Animal rescatado  en la BD y lo eliminamos solo con el usuario que lo creo en la BD como Admin
    const rescueDelete = await Animal.findOneAndDelete({ user_id: process.env.ADMIN, _id: rescuedAnimalId}).populate('user_id', 'name last_name');


    // Verificar si existe la publicación en la BD y si se eliminó de la BD
    if(!rescueDelete){
      return res.status(404).send({
        status: "error",
        message: "No se ha encontrado o no tienes permiso para eliminar esta publicación"
      });
    }

    // Devolvemos respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "Registro de Animal rescatado eliminado con éxito",
      publication: rescueDelete
    });

  } catch (error) {
    console.log(`Error al eliminar el registro del Animal rescatado: ${ error }`);
    return res.status(500).send({
      status: "error",
      message: "Error al eliminar el registro del Animal rescatado"
    });    
  }
};

// Método para listar los registros de animales rescatados
export const rescuedAnimals = async (req, res) => {
  try {
    // ID del usuario Administrador
    const userId = "6712cbfa95a2ee0cff3a308d";
    //const userId = req.params.id;
   

    // Asignar el número de página a mostrar inicialmente
    let page = req.params.page ? parseInt(req.params.page, 10) : 1;

    // Número de publicaciones que queremos mostrar por página
    let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 5;

    // Opciones de la consulta
    const options = {
      page: page,
      limit: itemsPerPage,
      sort: { created_at: -1 },
      populate: {
        path: 'user_id',
        select: '-nick -image -password -role -__v -email -created_at'
      },
      lean: true
    };

    // Buscar los registros de animales rescatados creados por el Administrador,  que no estan adoptados y estan en la fundacion aun. 
    const registeredAnimals = await Animal.paginate({ user_id: userId , adopted: "false"}, options);

    // Verificar si existen registros de animales rescatados 
    if(!registeredAnimals.docs || registeredAnimals.docs.length <= 0){
      return res.status(404).send({
        status: "error",
        message: "No hay registros de animales rescatados  pulicaciones para mostrar"
      });
    }

    // Devolver respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "Registros de animales rescatados encontrados: ",
      animals: registeredAnimals.docs,
      total: registeredAnimals.totalDocs,
      pages: registeredAnimals.totalPages,
      page: registeredAnimals.page,
      limit_items_ppage: registeredAnimals.limit
    });

  } catch (error) {
    console.log(`Error al mostrar los registros de animales rescatados:  ${ error }`);
    return res.status(500).send({
      status: "error",
      message: "Error al mostrar los registros de animales rescatados:"
    });
  }
};


// Método para subir imágenes a los animales rescatados
export const uploadMediaAnimals = async (req, res) => {
  try {
    // Obtener el ID de la publicación
    const rescuedAnimalId = req.params.id;

     //Control validacion del role del usuario que esta logueado que desea eliminar  el Animal rescatado
     const identity = req.user; 
     console.log(identity.role);   ///rol del usuario logueado

    if (identity.role !== "role_administratorf" ) {
      return res.status(409).send({
        status: "error",
        message: "¡No se tiene  el rol Admin para subir imagenes de  Animales Rescatados!"
      });
    }

    // Verificar si el Animal rescatado existe en la BD
    const rescuedAnimalExists = await Animal.findById(rescuedAnimalId);

    if(!rescuedAnimalExists){
      return res.status(404).send({
        status: "error",
        message: "No existe el Animal registrado indicado"
      });
    }

    // Verificar si se ha recibido en la petición un archivo
    if(!req.file){
      return res.status(400).send({
        status: "error",
        message: "La petición no incluye el archivo de imagen del animal rescatado"
      });
    }

    // Obtener la URL de Cloudinary
    const mediaUrl = req.file.path;

    // Actualizar el animal rescatado con la URL de la imagen
    const rescuedAnimalUpdated = await Animal.findByIdAndUpdate(
      rescuedAnimalId,
      { image_url: mediaUrl },
      { new: true}
    );

    if(!rescuedAnimalUpdated){
      return res.status(500).send({
        status: "error",
        message: "Error en la subida de la imagen"
      });
    }

    // Devolver respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "Archivo subido con éxito",
      rescuedAnimal: rescuedAnimalUpdated,
      file: mediaUrl
    });

  } catch (error) {
    console.log(`Error al mostrar los Animales rescatados: ${ error }`);
    return res.status(500).send({
      status: "error",
      message: "Error al mostrar los Animales rescatados"
    });
  }
};


// Método para actualizar los datos de animales rescatados
export const updateAnimal = async (req, res) => {
  try {
    // Obtener los datos de la petición
    let paramsAnimalToUpdate = req.body;
    console.log(paramsAnimalToUpdate);    ////IMPRESION

   
        //Control validacion del usuario que esta logueado que desea actualizar el animal rescatado
    let userIdentity = req.user; 
    console.log(userIdentity);
       
      if (userIdentity.role !== "role_administratorf" ) {
        return res.status(409).send({
        status: "error",
        message: "¡No se tiene  el rol Admin para editar registros de Animales Rescatados!"
        });
      }
   
      // Validar los datos obtenidos del body (que los datos obligatorios existan)
      if(!paramsAnimalToUpdate.name || !paramsAnimalToUpdate.owner_name || !paramsAnimalToUpdate.species || !paramsAnimalToUpdate.gender ) {
        return res.status(400).json({
          status: "error",
          message: "Faltan datos para realizar la actualizacion exitosa  del registro  animal rescatado"
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

     // Verificar que el ID del animal esté presente en el body
    // const rescuedAnimalId = paramsAnimalToUpdate.id;

        // Obtener el ID del Animal rescatado desde la URL (parámetros)
     const rescuedAnimalId = req.params.id;
      

     if (!rescuedAnimalId) {
      return res.status(400).send({
        status: "error",
        message: "El ID del animal rescatado es obligatorio para actualizar"
      });
     }
      
    // Validar el formato del ObjectId
    if (!mongoose.Types.ObjectId.isValid(rescuedAnimalId)) {
      return res.status(400).send({
        status: "error",
        message: "El ID del animal rescatado no es válido"
      });
    }  

    // Actualizar el animal en la base de datos
    const rescuedAnimalUpdated = await Animal.findByIdAndUpdate(
      rescuedAnimalId,
      paramsAnimalToUpdate,
      { new: true }
    );


    // Devolver la respuesta exitosa
    return res.status(200).json({
      status: "success",
      message: "Animal rescatado actualizado correctamente",
      user: rescuedAnimalUpdated
    });
   
  }  catch (error) {
     console.log("Error al actualizar los datos del animal rescatado: ", error);
      return res.status(500).send({
       status: "error",
       message: "Error al actualizar los datos del animal rescatado usuario"
      });
    }
}

