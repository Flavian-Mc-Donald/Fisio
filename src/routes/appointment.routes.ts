import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentRepositoryMemory } from '../repositories/appointment.repository';
import { ClientRepositoryMemory } from '../repositories/client.repository';
import { InstructorRepositoryMemory } from '../repositories/instructor.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { UserRole } from '../types/roles.enum';

const appointmentRouter = Router();
const appointmentRepo = new AppointmentRepositoryMemory();
const clientRepo = new ClientRepositoryMemory();
const instructorRepo = new InstructorRepositoryMemory();
const appointmentService = new AppointmentService(appointmentRepo, clientRepo, instructorRepo);
const appointmentController = new AppointmentController(appointmentService);

appointmentRouter.use(authMiddleware);

appointmentRouter.post(
  '/',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.CLIENT),
  appointmentController.create
);

appointmentRouter.get(
  '/',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.INSTRUCTOR, UserRole.CLIENT),
  appointmentController.findAll
);

appointmentRouter.get(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.INSTRUCTOR, UserRole.CLIENT),
  appointmentController.findById
);

appointmentRouter.put(
  '/:id/reschedule',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.CLIENT),
  appointmentController.reschedule
);

appointmentRouter.put(
  '/:id/cancel',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.CLIENT),
  appointmentController.cancel
);

export {appointmentRouter};