import { Client } from '../models/client.model';
import { Appointment } from '../models/appointment.model';
import { isCreateClientDTO } from '../dtos/client.dto';
import { isCreateAppointmentDTO } from '../dtos/appointment.dto';
import { AppointmentStatus } from '../types/appointments-status.enum';

describe('Testes de Domínio e Validações de DTOs', () => {
  describe('Validação do Modelo Client (OOP e Encapsulamento)', () => {
    it('deve instanciar um cliente válido com sucesso', () => {
      const client = new Client(
        '1',
        'João Silva',
        'joao@email.com',
        30,
        'Rua das Palmeiras, 123',
        '123.456.789-00',
        75.5,
        'Ensino Superior Completo'
      );

      expect(client.id).toBe('1');
      expect(client.name).toBe('João Silva');
      expect(client.email).toBe('joao@email.com');
    });

    it('deve lançar erro se tentar criar cliente com e-mail inválido', () => {
      expect(() => {
        new Client('1', 'João Silva', 'email_sem_arroba', 30, 'Rua X', '123', 70, 'Ensino Médio');
      }).toThrow('O email do cliente é obrigatório e deve ser válido, por gentileza facilite-o.');
    });

    it('deve impedir que a idade seja menor ou igual a zero', () => {
      expect(() => {
        new Client('1', 'João Silva', 'joao@email.com', 0, 'Rua X', '123', 70, 'Ensino Médio');
      }).toThrow('Por favor insira uma idade válida');
    });
  });

  describe('Validação do Modelo Appointment (Regras Temporais)', () => {
    it('deve lançar erro se agendar consulta para data passada', () => {
      const dataPassada = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(); 
      expect(() => {
        new Appointment('app1', 'client1', 'inst1', 'Pilates', dataPassada);
      }).toThrow('Não é possível agendar consultas para datas passadas.');
    });

    it('deve permitir reagendar consulta para o futuro atualizando o status', () => {
      const amanha = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
      const depoisDeAmanha = new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString();

      const appointment = new Appointment('app1', 'client1', 'inst1', 'Pilates', amanha);
      appointment.reschedule(depoisDeAmanha);

      expect(appointment.status).toBe(AppointmentStatus.rescheduled);
      expect(appointment.dateTime.getTime()).toBe(new Date(depoisDeAmanha).getTime());
    });
  });

  describe('Validações de DTOs (Type Guards/Predicados)', () => {
    it('deve retornar true para CreateClientDTO estruturalmente correto', () => {
      const payload = {
        name: 'Lucas Souza',
        email: 'lucas@email.com',
        age: 28,
        address: 'Avenida Central, 456',
        cpf: '987.654.321-11',
        weight: 60.2,
        educationLevel: 'Pós-graduação'
      };
      expect(isCreateClientDTO(payload)).toBe(true);
    });

    it('deve retornar false para CreateClientDTO com campos vazios ou tipos inválidos', () => {
      const payloadInvalido = {
        name: 'Lucas',
        email: 'lucas_email.com', 
        age: 'vinte' 
      };
      expect(isCreateClientDTO(payloadInvalido)).toBe(false);
    });
  });
});