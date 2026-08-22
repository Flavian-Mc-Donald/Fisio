import { Router } from 'express';
import { InstructorController } from '../controllers/instructor.controller';
import { InstructorService } from '../services/instructor.service';
import { InstructorRepositoryMemory } from '../repositories/instructor.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { UserRole } from '../types/roles.enum';

const instructorRouter = Router();
const instructorRepo = new InstructorRepositoryMemory();
const instructorService = new InstructorService(instructorRepo);
const instructorController = new InstructorController(instructorService);

instructorRouter.use(authMiddleware);

instructorRouter.post(
  '/',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST),
  instructorController.create
);

instructorRouter.get(
  '/',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.INSTRUCTOR, UserRole.CLIENT),
  instructorController.findAll
);


instructorRouter.get(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.INSTRUCTOR, UserRole.CLIENT),
  instructorController.findById
);


instructorRouter.put(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.INSTRUCTOR),
  instructorController.update
);

instructorRouter.delete(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST),
  instructorController.delete
);

export {instructorRouter};