import { Instructor } from '../../models/instructor.model';
import { InstructorRepository } from '../instructor.repository';
import { InstructorMongoModel, IInstructorDocument } from '../../models/schemas/instructor.schema';

export class InstructorRepositoryMongo extends InstructorRepository {
  
  private mapToDomain(doc: IInstructorDocument): Instructor {
    return new Instructor(
      doc._id,
      doc.name,
      doc.email,
      doc.cpf,
      doc.specialties,
      doc.crefito
    );
  }

  async save(instructor: Instructor): Promise<Instructor> {
    const doc = await InstructorMongoModel.findByIdAndUpdate(
      instructor.id,
      {
        _id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        cpf: instructor.cpf,
        specialties: instructor.specialties,
        crefito: instructor.crefito,
        role: instructor.role
      },
      { new: true, upsert: true }
    );

    return this.mapToDomain(doc!);
  }

  async findById(id: string): Promise<Instructor | null> {
    const doc = await InstructorMongoModel.findById(id);
    return doc ? this.mapToDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<Instructor | null> {
    const doc = await InstructorMongoModel.findOne({ email: email.toLowerCase() });
    return doc ? this.mapToDomain(doc) : null;
  }

  async findAll(): Promise<Instructor[]> {
    const docs = await InstructorMongoModel.find();
    return docs.map(doc => this.mapToDomain(doc));
  }

  async delete(id: string): Promise<boolean> {
    const result = await InstructorMongoModel.findByIdAndDelete(id);
    return result !== null;
  }
}