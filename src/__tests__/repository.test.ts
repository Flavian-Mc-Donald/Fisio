import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { UserRole } from '../types/roles.enum';

describe('Testes dos Middlewares de Segurança (Autenticação e Autorização)', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  describe('authMiddleware (Autenticação)', () => {
    it('deve retornar 401 se o cabeçalho Authorization não for fornecido', () => {
      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.stringContaining('Acesso negado, o token de autenticação deve seguir o formato: "Bearer <UserID>:<Role>"')
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se o token não estiver no formato userId:ROLE', () => {
      mockRequest.headers = { authorization: 'Bearer tokeninvalido' };

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('deve decodificar o token corretamente e chamar next() se for válido', () => {
      mockRequest.headers = { authorization: 'Bearer c1:CLIENT' };

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.userId).toBe('c1');
      expect(mockRequest.role).toBe(UserRole.CLIENT);
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('requireRole (Autorização)', () => {
    it('deve retornar 403 se o usuário possuir papel não autorizado', () => {
      mockRequest.role = UserRole.CLIENT;
      const middleware = requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST);

      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.stringContaining('Acesso Proibido, seu perfil (client) não tem permissão suficiente.')
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});