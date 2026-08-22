import { Appointment } from '../models/appointment.model';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { ClientRepository } from '../repositories/client.repository';
import { InstructorRepository } from '../repositories/instructor.repository';
import { CreateAppointmentDTO } from '../dtos/appointment.dto';
import { UserRole } from '../types/roles.enum';
import { AppointmentStatus } from '../types/appointments-status.enum';

export class AppointmentService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private clientRepository: ClientRepository,
    private instructorRepository: InstructorRepository
  ) {}

  async create(
    dto: CreateAppointmentDTO,
    requestingUserId: string,
    requestingUserRole: UserRole
  ): Promise<Appointment> {
    if (requestingUserRole === UserRole.CLIENT) {
      if (dto.clientId !== requestingUserId) {
        throw new Error('Acesso negado. Alunos só podem agendar consultas para si mesmos.');
      }
    } else if (requestingUserRole === UserRole.INSTRUCTOR) {
      throw new Error('Acesso negado. Instrutores não têm permissão para criar agendamentos.');
    }

    const client = await this.clientRepository.findById(dto.clientId);
    if (!client) {
      throw new Error('Cliente associado não encontrado no sistema.');
    }

    const instructor = await this.instructorRepository.findById(dto.instructorId);
    if (!instructor) {
      throw new Error('Instrutor associado não encontrado no sistema.');
    }

    const hasSpecialty = instructor.specialties.some(
      s => s.toLowerCase() === dto.discipline.toLowerCase()
    );
    if (!hasSpecialty) {
      throw new Error(`O instrutor ${instructor.name} não atua na especialidade de ${dto.discipline}.`);
    }

    const targetDate = new Date(dto.dateTime);
    const instructorAppointments = await this.appointmentRepository.findByInstructorId(dto.instructorId);
    
    const conflict = instructorAppointments.find(
      a => a.status !== AppointmentStatus.canceled && a.dateTime.getTime() === targetDate.getTime()
    );

    if (conflict) {
      throw new Error('Este instrutor já possui um agendamento ativo exatamente neste mesmo dia e horário.');
    }

    const id = 'app_' + Math.random().toString(36).substring(2, 9);
    const appointment = new Appointment(
      id,
      dto.clientId,
      dto.instructorId,
      dto.discipline,
      dto.dateTime
    );

    return this.appointmentRepository.save(appointment);
  }

  async reschedule(
    appointmentId: string,
    newDateTime: string,
    requestingUserId: string,
    requestingUserRole: UserRole
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error('Agendamento de consulta não encontrado.');
    }

    if (requestingUserRole === UserRole.CLIENT) {
      if (appointment.clientId !== requestingUserId) {
        throw new Error('Acesso negado. Você só pode reagendar suas próprias consultas.');
      }
    } else if (requestingUserRole === UserRole.INSTRUCTOR) {
      throw new Error('Acesso negado. Instrutores não têm permissão para reagendar consultas.');
    }

    const targetDate = new Date(newDateTime);
    const instructorAppointments = await this.appointmentRepository.findByInstructorId(appointment.instructorId);

    const conflict = instructorAppointments.find(
      a => a.id !== appointment.id && a.status !== AppointmentStatus.canceled && a.dateTime.getTime() === targetDate.getTime()
    );

    if (conflict) {
      throw new Error('Este instrutor já possui outro agendamento ativo exatamente neste novo dia e horário.');
    }

    appointment.reschedule(newDateTime);

    return this.appointmentRepository.save(appointment);
  }

  async cancel(
    appointmentId: string,
    requestingUserId: string,
    requestingUserRole: UserRole
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error('Agendamento de consulta não encontrado.');
    }

    if (requestingUserRole === UserRole.CLIENT) {
      if (appointment.clientId !== requestingUserId) {
        throw new Error('Acesso negado. Você só pode cancelar as suas próprias consultas.');
      }
    } else if (requestingUserRole === UserRole.INSTRUCTOR) {
      throw new Error('Acesso negado. Instrutores não têm permissão para cancelar consultas.');
    }

    appointment.cancel();

    return this.appointmentRepository.save(appointment);
  }

  async findById(
    appointmentId: string,
    requestingUserId: string,
    requestingUserRole: UserRole
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error('Agendamento de consulta não encontrado.');
    }

    if (requestingUserRole === UserRole.CLIENT) {
      if (appointment.clientId !== requestingUserId) {
        throw new Error('Acesso negado. Você não tem permissão para visualizar consultas de outros alunos.');
      }
    } else if (requestingUserRole === UserRole.INSTRUCTOR) {
      if (appointment.instructorId !== requestingUserId) {
        throw new Error('Acesso negado. Você só pode visualizar consultas atribuídas a você.');
      }
    }

    return appointment;
  }

  async findAll(requestingUserId: string, requestingUserRole: UserRole): Promise<Appointment[]> {
    if (requestingUserRole === UserRole.CLIENT) {
      return this.appointmentRepository.findByClientId(requestingUserId);
    }

    if (requestingUserRole === UserRole.INSTRUCTOR) {
      return this.appointmentRepository.findByInstructorId(requestingUserId);
    }

    return this.appointmentRepository.findAll();
  }
}