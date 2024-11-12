import { Router } from "express";
import { testAnimal, register, showRescuedAnimal, deleteRescuedAnimal, rescuedAnimals, uploadMediaAnimals, updateAnimal } from "../controllers/animal.js";
import { ensureAuth} from "../middlewares/auth.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;


// Configuración de subida de archivos en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'rescued_animals',
      allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],  // formatos permitidos
      public_id: (req, file) => 'rescued_animal-' + Date.now()
    }
  });
  
  // Configurar multer con límites de tamaño de archivos
  const uploads = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 } // Limitar tamaño a 1 MB
  });

const router = Router();

// Definir rutas de Publication
router.get('/test-animal/', testAnimal);
router.post('/register/', ensureAuth, register);
router.get('/rescued-animal/:id', ensureAuth, showRescuedAnimal); 
router.delete('/delete-rescued-animal/:id', ensureAuth, deleteRescuedAnimal); 
router.get('/animals-list/:page?', ensureAuth, rescuedAnimals); 
router.post('/upload-media-animals/:id', [ensureAuth, uploads.single("file0")], uploadMediaAnimals);
router.put('/update-register/:id', ensureAuth, updateAnimal); 



//Exportar el Router
export default router;

