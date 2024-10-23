import { Router } from "express";
import { testAnimal, register } from "../controllers/animal.js";

const router = Router();

// Definir rutas de Publication
router.get('/test-animal', testAnimal);
router.post('/register', register);


//Exportar el Router
export default router;

