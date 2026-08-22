import { UserRole } from './roles.enum';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            role?: UserRole;
        }
    }
}
