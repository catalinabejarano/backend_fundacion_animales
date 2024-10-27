import { Router } from "express";
import { testAnimal, register, updateAnimal } from "../controllers/animal.js";
import { ensureAuth} from "../middlewares/auth.js";

const router = Router();

// Definir rutas de Publication
router.get('/test-animal', testAnimal);
router.post('/register', ensureAuth, register);
router.put('/update', ensureAuth, updateAnimal);


//Exportar el Router
export default router;

