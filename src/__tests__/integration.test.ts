import request from 'supertest';
import app from '../app';
import { ClientRepositoryMemory } from '../repositories/client.repository';
import { InstructorRepositoryMemory } from '../repositories/instructor.repository';
import { AppointmentRepositoryMemory } from '../repositories/appointment.repository';

describe('Testes de Integração E2E - API FisioV1', () => {
  beforeEach(() => {
    ClientRepositoryMemory.clear();
    InstructorRepositoryMemory.clear();
    AppointmentRepositoryMemory.clear();
  });

  describe('Segurança - Autenticação e Autorização', () => {
    it('deve retornar 401 ao tentar acessar qualquer rota sem token', async () => {
      const response = await request(app).get('/clients');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 403 se um Cliente tentar cadastrar um Instrutor', async () => {
      const response = await request(app)
        .post('/instructors')
        .set('Authorization', 'Bearer c1:CLIENT')
        .send({
          name: 'Instrutor Teste',
          email: 'teste@instrutor.com',
          cpf: '123.456.789-00',
          specialties: ['Pilates'],
          crefito: 123
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Acesso Proibido');
    });
  });

  describe('Fluxo E2E - Clientes (CRUD)', () => {
    it('deve permitir que ADMIN crie, consulte, atualize e remova um cliente com sucesso', async () => {
      const createResponse = await request(app)
        .post('/clients')
        .set('Authorization', 'Bearer admin1:ADMIN')
        .send({
          name: 'Juliana Alencar',
          email: 'juliana@email.com',
          age: 28,
          address: 'Rua das Acacias, 45',
          cpf: '111.222.333-44',
          weight: 60,
          educationLevel: 'Ensino Superior Completo'
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body).toHaveProperty('_id');
      const clientId = createResponse.body._id;
      const getResponse = await request(app)
        .get(`/clients/${clientId}`)
        .set('Authorization', 'Bearer admin1:ADMIN');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body._name).toBe('Juliana Alencar');
      const updateResponse = await request(app)
        .put(`/clients/${clientId}`)
        .set('Authorization', 'Bearer admin1:ADMIN')
        .send({
          name: 'Juliana Alencar Silveira',
          weight: 59
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body._name).toBe('Juliana Alencar Silveira');
      const deleteResponse = await request(app)
        .delete(`/clients/${clientId}`)
        .set('Authorization', 'Bearer admin1:ADMIN');

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
    });
  });
});