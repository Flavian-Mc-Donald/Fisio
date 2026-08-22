import { ClientService } from '../services/client.service';
import { InstructorService } from '../services/instructor.service';
import { AppointmentService } from '../services/appointment.service';
import { ClientRepositoryMemory } from '../repositories/client.repository';
import { InstructorRepositoryMemory } from '../repositories/instructor.repository';
import { AppointmentRepositoryMemory } from '../repositories/appointment.repository';
import { UserRole } from '../types/roles.enum';

describe('Testes da Camada de Serviço (Services com Regras de Negócio)', () => {
  let clientService: ClientService;
  let instructorService: InstructorService;
  let appointmentService: AppointmentService;

  let clientRepo: ClientRepositoryMemory;
  let instructorRepo: InstructorRepositoryMemory;
  let appointmentRepo: AppointmentRepositoryMemory;

  beforeEach(() => {
    clientRepo = new ClientRepositoryMemory();
    instructorRepo = new InstructorRepositoryMemory();
    appointmentRepo = new AppointmentRepositoryMemory();

    ClientRepositoryMemory.clear();
    InstructorRepositoryMemory.clear();
    AppointmentRepositoryMemory.clear();

    clientService = new ClientService(clientRepo, instructorRepo);
    instructorService = new InstructorService(instructorRepo);
    appointmentService = new AppointmentService(appointmentRepo, clientRepo, instructorRepo);
  });

  describe('AppointmentService - Regras de Agendamento', () => {
    let clientId: string;
    let instructorId: string;

    beforeEach(async () => {
      const client = await clientService.create({
        name: 'Carlos Santos',
        email: 'carlos@email.com',
        age: 35,
        address: 'Rua Principal, 10',
        cpf: '111.111.111-11',
        weight: 80,
        educationLevel: 'Ensino Médio'
      });
      clientId = client.id;

      const instructor = await instructorService.create({
        name: 'Dra. Patricia',
        email: 'patricia@fisioclinic.com',
        cpf: '333.333.333-33',
        specialties: ['Pilates', 'Fisioterapia Pélvica'],
        crefito: 98765
      });
      instructorId = instructor.id;
    });

    it('deve lançar erro se o instrutor não atuar na especialidade desejada', async () => {
      const amanha = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

      await expect(
        appointmentService.create(
          {
            clientId,
            instructorId,
            discipline: 'Fisioterapia Geriátrica', 
            dateTime: amanha
          },
          clientId,
          UserRole.CLIENT
        )
      ).rejects.toThrow('não atua na especialidade de Fisioterapia Geriátrica');
    });

    it('deve barrar se houver choque de horários (mesmo instrutor, mesmo dia e hora)', async () => {
      const amanha = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

      await appointmentService.create(
        {
          clientId,
          instructorId,
          discipline: 'Pilates',
          dateTime: amanha
        },
        clientId,
        UserRole.CLIENT
      );

      await expect(
        appointmentService.create(
          {
            clientId,
            instructorId,
            discipline: 'Pilates',
            dateTime: amanha
          },
          clientId,
          UserRole.CLIENT
        )
      ).rejects.toThrow('Este instrutor já possui um agendamento ativo exatamente neste mesmo dia e horário.');
    });
  });
});