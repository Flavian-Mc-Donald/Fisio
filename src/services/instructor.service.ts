import { Instructor } from '../models/instructor.model';
import { InstructorRepository } from '../repositories/instructor.repository';
import { CreateInstructorDTO } from '../dtos/instructor.dto';

export class InstructorService {
  constructor(private instructorRepository: InstructorRepository) {}

  async create(dto: CreateInstructorDTO): Promise<Instructor> {
    const existing = await this.instructorRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error('Já existe um instrutor cadastrado com este e-mail.');
    }

    const id = 'inst_' + Math.random().toString(36).substring(2, 9);
    const instructor = new Instructor(
      id,
      dto.name,
      dto.email,
      dto.cpf,
      dto.specialties,
      dto.crefito
    );

    return this.instructorRepository.save(instructor);
  }

  async findById(id: string): Promise<Instructor> {
    const instructor = await this.instructorRepository.findById(id);
    if (!instructor) {
      throw new Error('Instrutor não encontrado.');
    }
    return instructor;
  }

  async findAll(): Promise<Instructor[]> {
    return this.instructorRepository.findAll();
  }

  async update(id: string, dto: Partial<CreateInstructorDTO>): Promise<Instructor> {
    const instructor = await this.findById(id);

    if (dto.name !== undefined) instructor.name = dto.name;
    if (dto.email !== undefined) {
      if (dto.email !== instructor.email) {
        const existing = await this.instructorRepository.findByEmail(dto.email);
        if (existing) {
          throw new Error('Já existe um instrutor cadastrado com este e-mail.');
        }
      }
      instructor.email = dto.email;
    }
    if (dto.cpf !== undefined) instructor.cpf = dto.cpf;
    if (dto.specialties !== undefined) instructor.specialties = dto.specialties;
    if (dto.crefito !== undefined) instructor.crefito = dto.crefito;

    return this.instructorRepository.save(instructor);
  }

  async delete(id: string): Promise<boolean> {
    const exists = await this.instructorRepository.findById(id);
    if (!exists) {
      throw new Error('Instrutor não encontrado.');
    }
    return this.instructorRepository.delete(id);
  }
}