import {
    Request, 
    Response,
    NextFunction
}
from 'express';
import { UserRole } from '../types/roles.enum';

export const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.role) {
            res.status(401).json({
                error: 'Acesso Negado. Usuário não reconhecido.'
            });
            return;
        }
    const isAllowed = allowedRoles.includes(req.role);
    if (!isAllowed) {
        res.status(403).json({
            error: `Acesso Proibido, seu perfil (${req.role}) não tem permissão suficiente.`
        });
        return;
    }
    next(); 
  };
};