import { Client } from '../../models/client.model';
import { ClientRepository } from '../client.repository';
import { ClientMongoModel, IClientDocument } from '../../models/schemas/client.schema';

export class ClientRepositoryMongo extends ClientRepository {
  
  private mapToDomain(doc: IClientDocument): Client {
    return new Client(
      doc._id,
      doc.name,
      doc.email,
      doc.age,
      doc.address,
      doc.cpf,
      doc.weight,
      doc.educationLevel,
      doc.assignedInstructorId
    );
  }

  async save(client: Client): Promise<Client> {
    const doc = await ClientMongoModel.findByIdAndUpdate(
      client.id,
      {
        _id: client.id,
        name: client.name,
        email: client.email,
        age: client.age,
        address: client.address,
        cpf: client.cpf,
        weight: client.weight,
        educationLevel: client.educationLevel,
        assignedInstructorId: client.assignedInstructorId,
        role: client.role
      },
      { new: true, upsert: true } 
    );

    return this.mapToDomain(doc!);
  }

  async findById(id: string): Promise<Client | null> {
    const doc = await ClientMongoModel.findById(id);
    return doc ? this.mapToDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const doc = await ClientMongoModel.findOne({ email: email.toLowerCase() });
    return doc ? this.mapToDomain(doc) : null;
  }

  async findAll(): Promise<Client[]> {
    const docs = await ClientMongoModel.find();
    return docs.map(doc => this.mapToDomain(doc));
  }

  async update(id: string, clientData: Partial<Client>): Promise<Client | null> {
    const doc = await ClientMongoModel.findByIdAndUpdate(
      id,
      { $set: clientData },
      { new: true }
    );
    return doc ? this.mapToDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ClientMongoModel.findByIdAndDelete(id);
    return result !== null;
  }
}
