import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { ClientService } from '../services/client.service';
import { ClientRepositoryMemory } from '../repositories/client.repository';
import { InstructorRepositoryMemory } from '../repositories/instructor.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { UserRole } from '../types/roles.enum';

const clientRouter = Router();
const clientRepo = new ClientRepositoryMemory();
const instructorRepo = new InstructorRepositoryMemory();
const clientService = new ClientService(clientRepo, instructorRepo);
const clientController = new ClientController(clientService);


clientRouter.use(authMiddleware);

clientRouter.post(
  '/',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST),
  clientController.create
);

clientRouter.get(
  '/',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.INSTRUCTOR),
  clientController.findAll
);

clientRouter.get(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.INSTRUCTOR, UserRole.CLIENT),
  clientController.findById
);

clientRouter.put(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.CLIENT),
  clientController.update
);

clientRouter.delete(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST),
  clientController.delete
);

export { clientRouter };