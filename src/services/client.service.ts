import { Client } from '../models/client.model';
import { ClientRepository } from '../repositories/client.repository';
import { InstructorRepository } from '../repositories/instructor.repository';
import { CreateClientDTO } from '../dtos/client.dto';
import { UserRole } from '../types/roles.enum';

export class ClientService {
  constructor(
    private clientRepository: ClientRepository,
    private instructorRepository: InstructorRepository
  ) {}

  async create(dto: CreateClientDTO): Promise<Client> {
    const existing = await this.clientRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error('Já existe um cliente cadastrado com este e-mail.');
    }

    if (dto.assignedInstructorId) {
      const instructorExists = await this.instructorRepository.findById(dto.assignedInstructorId);
      if (!instructorExists) {
        throw new Error('O instrutor associado informado não existe.');
      }
    }

    const id = 'cli_' + Math.random().toString(36).substring(2, 9);
    const client = new Client(
      id,
      dto.name,
      dto.email,
      dto.age,
      dto.address,
      dto.cpf,
      dto.weight,
      dto.educationLevel,
      dto.assignedInstructorId
    );

    return this.clientRepository.save(client);
  }

  async findById(id: string, requestingUserId: string, requestingUserRole: UserRole): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error('Cliente não encontrado.');
    }

    if (requestingUserRole === UserRole.CLIENT) {
      if (client.id !== requestingUserId) {
        throw new Error('Acesso negado. Você só tem permissão para visualizar suas próprias informações.');
      }
    } else if (requestingUserRole === UserRole.INSTRUCTOR) {
      if (client.assignedInstructorId !== requestingUserId) {
        throw new Error('Acesso negado. Você só tem permissão para visualizar informações de alunos vinculados a você.');
      }
    }

    return client;
  }

  async findAll(requestingUserId: string, requestingUserRole: UserRole): Promise<Client[]> {
    if (requestingUserRole === UserRole.CLIENT) {
      throw new Error('Acesso negado. Alunos não têm permissão para listar todos os clientes da clínica.');
    }

    const allClients = await this.clientRepository.findAll();

    if (requestingUserRole === UserRole.INSTRUCTOR) {
      return allClients.filter(c => c.assignedInstructorId === requestingUserId);
    }

    return allClients;
  }

  async update(
    id: string,
    dto: Partial<CreateClientDTO>,
    requestingUserId: string,
    requestingUserRole: UserRole
  ): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error('Cliente não encontrado.');
    }

    if (requestingUserRole === UserRole.CLIENT) {
      if (client.id !== requestingUserId) {
        throw new Error('Acesso negado. Você só pode editar as suas próprias informações.');
      }
      if (dto.assignedInstructorId !== undefined) {
        throw new Error('Acesso negado. Clientes não têm permissão para alterar ou definir seu próprio instrutor.');
      }
    } else if (requestingUserRole === UserRole.INSTRUCTOR) {
      throw new Error('Acesso negado. Instrutores não têm permissão para editar dados cadastrais de clientes.');
    }

    if (dto.name !== undefined) client.name = dto.name;
    if (dto.age !== undefined) client.age = dto.age;
    if (dto.address !== undefined) client.address = dto.address;
    if (dto.cpf !== undefined) client.cpf = dto.cpf;
    if (dto.weight !== undefined) client.weight = dto.weight;
    if (dto.educationLevel !== undefined) client.educationLevel = dto.educationLevel;

    if (dto.email !== undefined) {
      if (dto.email !== client.email) {
        const existing = await this.clientRepository.findByEmail(dto.email);
        if (existing) {
          throw new Error('Já existe um cliente cadastrado com este e-mail.');
        }
      }
      client.email = dto.email;
    }

    if (dto.assignedInstructorId !== undefined) {
      if (dto.assignedInstructorId !== '') {
        const instructorExists = await this.instructorRepository.findById(dto.assignedInstructorId);
        if (!instructorExists) {
          throw new Error('O instrutor associado informado não existe.');
        }
        client.assignedInstructorId = dto.assignedInstructorId;
      } else {
        client.assignedInstructorId = '';
      }
    }

    return this.clientRepository.save(client);
  }

  async delete(id: string): Promise<boolean> {
    const exists = await this.clientRepository.findById(id);
    if (!exists) {
      throw new Error('Cliente não encontrado.');
    }
    return this.clientRepository.delete(id);
  }
}