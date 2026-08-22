import { 
    Request, 
    Response, NextFunction } 
    from "express";

import { UserRole } from "../types/roles.enum";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({
        error: 'Acesso negado, o token de autenticação deve seguir o formato: "Bearer <UserID>:<Role>"'
    });
    return;
    }

    const token = authHeader.split(' ')[1];
    if(!token || !token.includes(':')) {
        res.status(401).json({
            error: 'Token errado ou expirado; o token de autenticação deve seguir o formato: "<UserID>:<Role>'
        });
        return;
    }

    const [userId, roleStr] = token.split(':');
    const role = roleStr.toLowerCase() as UserRole;

    if (!Object.values(UserRole).includes(role)) {
        res.status(401).json({
          error: 'Token inválido o perfil de usuário não reconhecido.' 
        });
        return;
    }

    req.userId = userId;
    req.role = role;
    next();
};