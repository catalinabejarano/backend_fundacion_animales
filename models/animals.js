import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";  //Ayuda con la paginacion al listar animales rewscatados

const AnimalSchema = Schema ({
  user_id: {
    type: Schema.ObjectId,
    ref: "User",
    //required: true
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
    default: "fundacion",
    maxlength: [10, "Owner's Name cannot be more than 60 characters"],
  },
  species: {
    /* The species of this Animal */
    type: String,
    required: [true, 'Please specify the species of animal.'],
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
    type: Boolean,
  },
  diet: {
    /* List of dietary needs, if applicable */
    type: Array,
    default: "Pendiente de colocar alimentos"
  },
  image_url: {
    /* Url to Rescued Animal image */
    //required: [false, 'Please provide an image url for this Animal.'],
    type: String,
  },
  habits: {
    /* List of habits of this Animal */
    type: Array,
    default: "Pendiente de colocar habitos "
  },
  diseases: {
    /* List of diseases of this Animal*/
    type: Array,
    default: "Pendiente de colocar enfermedades"
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

