import { Schema, model } from 'mongoose';
import { UserRole } from '../../types/roles.enum';

export interface IInstructorDocument {
  _id: string; 
  name: string;
  email: string;
  cpf: string;
  specialties: string[];
  crefito: number;
  role: UserRole;
}

const instructorSchema = new Schema<IInstructorDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    cpf: { type: String, required: true, trim: true },
    specialties: { type: [String], required: true },
    crefito: { type: Number, required: true, min: 1 },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.INSTRUCTOR }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const InstructorMongoModel = model<IInstructorDocument>('Instructor', instructorSchema);