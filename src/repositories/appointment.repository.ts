import app from '../app';
import { Appointment } from '../models/appointment.model';

export abstract class AppointmentRepository {
    abstract save(appointment: Appointment): Promise<Appointment>;
    abstract findById(id: string): Promise<Appointment | null>;
    abstract findAll(): Promise<Appointment[]>;
    abstract findByClientId(clientId: string): Promise<Appointment[]>;
    abstract findByInstructorId(InstructorId: string): Promise<Appointment[]>;
    abstract delete(id: string): Promise<boolean>;
}

export class AppointmentRepositoryMemory extends AppointmentRepository {
    private static appointments: Appointment[] = [];

    async save(appointment: Appointment): Promise<Appointment> {
        const index = AppointmentRepositoryMemory.appointments.findIndex(a => a.id === appointment.id);
        if (index >= 0) {
            AppointmentRepositoryMemory.appointments[index] = appointment;
        } else {
            AppointmentRepositoryMemory.appointments.push(appointment);
        }
        return appointment;
    }
    async findById(id: string): Promise<Appointment | null> {
        const appointment = AppointmentRepositoryMemory.appointments.find(a => a.id === id);
        return appointment || null;
    }

    async findAll(): Promise<Appointment[]> {
        return [...AppointmentRepositoryMemory.appointments];
    }

    async findByClientId(clientId: string): Promise<Appointment[]> {
        return AppointmentRepositoryMemory.appointments.filter(a => a.clientId === clientId);
    }

    async findByInstructorId(InstructorId: string): Promise<Appointment[]> {
        return AppointmentRepositoryMemory.appointments.filter(a => a.instructorId === InstructorId);  
    }
    async delete(id: string): Promise<boolean> {
        const index = AppointmentRepositoryMemory.appointments.findIndex(a => a.id === id);
        if (index >= 0) {
            AppointmentRepositoryMemory.appointments.splice(index, 1);
            return true;
        }
        return false;
    }
    static clear(): void {
        AppointmentRepositoryMemory.appointments = [];
    }
}