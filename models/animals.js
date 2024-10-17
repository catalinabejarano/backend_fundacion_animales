//import mongoose from 'mongoose'
/* PetSchema will correspond to a collection in your MongoDB database. */
//const PetSchema = new mongoose.Schema({
 
import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";  //Ayuda con la paginacion al listar usuarios 

const AnimalSchema = Schema ({
name: {
    /* The name of this Animal */
    type: String,
    required: [true, 'Please provide a name for this animal.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  owner_name: {
    /* The owner of this Animal */
    type: String,
    enum: ['gFundacion', 'Particular'],
    required: [true, "Please provide the animal owner's name"],
    maxlength: [60, "Owner's Name cannot be more than 60 characters"],
  },
  species: {
    /* The species of this Animal */
    type: String,
    enum: ['gato', 'perro'],
    required: [true, 'Please specify the species of animal.'],
    maxlength: [40, 'Species specified cannot be more than 40 characters'],
  },
  gender: {
    /* Gender of the Animal */
    type: String,
    enum: ['macho', 'hembra'],
    required: [true, 'Please specify the gender of this animal.'],
  },
  age: {
    /* Animal's age, if applicable */
    type: Number,
  },
  trained: {
    /* Boolean trained value, if applicable */
    required: [true, 'Please specify if is trained.'],
    type: Boolean,
  },
  diet: {
    /* List of dietary needs, if applicable */

    type: Array,
  },
  image_url: {
    /* Url to pet image */
    required: [true, 'Please provide an image url for this Animal.'],
    type: String,
  },
  likes: {
    /* List of things this Animal likes to do */

    type: Array,
  },
  dislikes: {
    /* List of things this Animal does not like to do */

    type: Array,
  },
  adopted: {
    /* Adoption of this Animal */
    required: [false, 'Please provide if is adopted this Animal'],
    type: Boolean,
  }
});

// Configurar el plugin de paginación de Mongo
AnimalSchema.plugin(mongoosePaginate);

export default model("Animal", AnimalSchema, "animals_list");


//})
//export default mongoose.models.Pet || mongoose.model('Pet', PetSchema)
