import { Router } from 'express';
import { InstructorController } from '../controllers/instructor.controller';
import { InstructorService } from '../services/instructor.service'; 
import { InstructorRepositoryMongo } from '../repositories/mongo/instructor.repository.mongo';

const instructorRouter = Router();
const instructorRepo = new InstructorRepositoryMongo();
const instructorService = new InstructorService(instructorRepo);
const instructorController = new InstructorController(instructorService);

instructorRouter.post('/', (req: any, res) => instructorController.create(req, res));
instructorRouter.get('/', (req: any, res) => instructorController.findAll(req, res));
instructorRouter.get('/:id', (req, res) => instructorController.findById(req, res));
instructorRouter.put('/:id', (req, res) => instructorController.update(req, res));
instructorRouter.delete('/:id', (req, res) => instructorController.delete(req, res));

export default instructorRouter;