import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentRepositoryMongo } from '../repositories/mongo/appointment.repository.mongo';
import { ClientRepositoryMongo } from '../repositories/mongo/client.repository.mongo';
import { InstructorRepositoryMongo } from '../repositories/mongo/instructor.repository.mongo';

const appointmentRouter = Router();

const appointmentRepo = new AppointmentRepositoryMongo();
const clientRepo = new ClientRepositoryMongo();
const instructorRepo = new InstructorRepositoryMongo();

const appointmentService = new AppointmentService(appointmentRepo, clientRepo, instructorRepo);
const appointmentController = new AppointmentController(appointmentService);

appointmentRouter.post('/', (req, res) => appointmentController.create(req, res));
appointmentRouter.get('/', (req, res) => appointmentController.findAll(req, res));
appointmentRouter.get('/:id', (req, res) => appointmentController.findById(req, res));
appointmentRouter.put('/:id', (req, res) => appointmentController.update(req, res));
appointmentRouter.delete('/:id', (req, res) => appointmentController.delete(req, res));

export default appointmentRouter;