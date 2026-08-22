import {
    Request, 
    Response, 
    NextFunction
} 
from 'express';
export const logMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    const timestamp = new Date().toISOString();
    const { method, url } = req;
    console.log(`[${timestamp}] ${method} ${url}`);
    next();
};