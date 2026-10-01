import { Schema, model } from 'mongoose';

export interface IAppointmentDocument {
  _id: string; // <-- ID customizado como string
  clientId: string;
  instructorId: string;
  discipline: string;
  dateTime: Date;
  status: 'SCHEDULED' | 'RESCHEDULED' | 'CANCELED';
}

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    _id: { type: String, required: true },
    clientId: { type: String, required: true, ref: 'Client' },
    instructorId: { type: String, required: true, ref: 'Instructor' },
    discipline: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['SCHEDULED', 'RESCHEDULED', 'CANCELED'], 
      default: 'SCHEDULED' 
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const AppointmentMongoModel = model<IAppointmentDocument>('Appointment', appointmentSchema);