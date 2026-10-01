import { Schema, model } from 'mongoose';
import { UserRole } from '../../types/roles.enum';

export interface IClientDocument {
  _id: string; 
  name: string;
  email: string;
  age: number;
  address: string;
  cpf: string;
  weight: number;
  educationLevel: string;
  assignedInstructorId?: string;
  role: UserRole;
}

const clientSchema = new Schema<IClientDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    age: { type: Number, required: true, min: 1 },
    address: { type: String, required: true, trim: true },
    cpf: { type: String, required: true, trim: true },
    weight: { type: Number, required: true, min: 0.1 },
    educationLevel: { type: String, required: true, trim: true },
    assignedInstructorId: { type: String, required: false },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CLIENT }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const ClientMongoModel = model<IClientDocument>('Client', clientSchema);