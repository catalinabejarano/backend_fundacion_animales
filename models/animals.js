//import mongoose from 'mongoose'
/* PetSchema will correspond to a collection in your MongoDB database. */
//const PetSchema = new mongoose.Schema({
 
import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";  //Ayuda con la paginacion al listar animales rewscatados

const AnimalSchema = Schema ({
  user_id: {
    type: Schema.ObjectId,
    ref: "User",
    required: true
  },
  user_role: {
    type: Schema.ObjectId,
    ref: "User",
    required: true
  },
name: {
    /* The name of this Animal */
    type: String,
    required: [true, 'Please provide a name for this animal.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
    unique: true,
  },
  owner_name: {
    /* The owner of this Animal */
    type: String,
    enum: ['Fundacion', 'Particular'],
    required: [false, "Please provide the animal owner's name"],
    maxlength: [60, "Owner's Name cannot be more than 60 characters"],
  },
  species: {
    /* The species of this Animal */
    type: String,
    enum: ['Gato', 'Perro'],
    required: [true, 'Please specify the species of animal.'],
    maxlength: [10, 'Species specified cannot be more than 40 characters'],
  },
  gender: {
    /* Gender of the Animal */
    type: String,
    enum: ['Macho', 'Hembra'],
    required: [true, 'Please specify the gender of this animal.'],
  },
  age: {
    /* Animal's age, if applicable */
    type: Number,
  },
  trained: {
    /* Boolean trained value, if applicable */
    required: [false, 'Please specify if is trained.'],
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
    maxlength: [20, 'URL donde esta la iamgen almacenada del Animal Rescatado'],
  },
  habits: {
    /* List of habits of this Animal */

    type: Array,
  },
  diseases: {
    /* List of diseases of this Animal*/

    type: Array,
  },
  adopted: {
    /* Adoption of this Animal */
    required: [false, 'Please provide if is adopted this Animal'],
    type: Boolean,
    default: "false"
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Configurar el plugin de paginación de Mongo
AnimalSchema.plugin(mongoosePaginate);

export default model("Animal", AnimalSchema, "animals");


//})
//export default mongoose.models.Pet || mongoose.model('Pet', PetSchema)
