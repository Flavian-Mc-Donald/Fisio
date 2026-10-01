import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { ClientService } from '../services/client.service';
import { ClientRepositoryMongo } from '../repositories/mongo/client.repository.mongo';
import { InstructorRepositoryMongo } from '../repositories/mongo/instructor.repository.mongo';

const clientRouter = Router();

const clientRepo = new ClientRepositoryMongo();
const instructorRepo = new InstructorRepositoryMongo();
const clientService = new ClientService(clientRepo, instructorRepo);
const clientController = new ClientController(clientService);

clientRouter.post('/', (req, res) => clientController.create(req, res));
clientRouter.get('/', (req, res) => clientController.findAll(req, res));
clientRouter.get('/:id', (req, res) => clientController.findById(req, res));
clientRouter.put('/:id', (req, res) => clientController.update(req, res));
clientRouter.delete('/:id', (req, res) => clientController.delete(req, res));

export default clientRouter;