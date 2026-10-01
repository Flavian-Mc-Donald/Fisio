import { Appointment } from '../../models/appointment.model';
import { AppointmentRepository } from '../appointment.repository';
import { AppointmentMongoModel, IAppointmentDocument } from '../../models/schemas/appointment.schema';

export class AppointmentRepositoryMongo extends AppointmentRepository {

  private mapToDomain(doc: IAppointmentDocument): Appointment {
    const formattedDate = doc.dateTime instanceof Date ? doc.dateTime.toISOString() : String(doc.dateTime);
    const status = doc.status as 'SCHEDULED' | 'RESCHEDULED' | 'CANCELED';

    return new Appointment(
      doc._id,
      doc.clientId,
      doc.instructorId,
      doc.discipline,
      formattedDate,
      status
    );
  }

  async save(appointment: Appointment): Promise<Appointment> {
    const doc = await AppointmentMongoModel.findByIdAndUpdate(
      appointment.id,
      {
        _id: appointment.id,
        clientId: appointment.clientId,
        instructorId: appointment.instructorId,
        discipline: appointment.discipline,
        dateTime: appointment.dateTime,
        status: appointment.status
      },
      { new: true, upsert: true }
    );

    return this.mapToDomain(doc!);
  }

  async findById(id: string): Promise<Appointment | null> {
    const doc = await AppointmentMongoModel.findById(id);
    return doc ? this.mapToDomain(doc) : null;
  }

  async findAll(): Promise<Appointment[]> {
    const docs = await AppointmentMongoModel.find();
    return docs.map(doc => this.mapToDomain(doc));
  }

  async findByClientId(clientId: string): Promise<Appointment[]> {
    const docs = await AppointmentMongoModel.find({ clientId });
    return docs.map(doc => this.mapToDomain(doc));
  }

  async findByInstructorId(instructorId: string): Promise<Appointment[]> {
    const docs = await AppointmentMongoModel.find({ instructorId });
    return docs.map(doc => this.mapToDomain(doc));
  }

  async delete(id: string): Promise<boolean> {
    const result = await AppointmentMongoModel.findByIdAndDelete(id);
    return result !== null;
  }
}