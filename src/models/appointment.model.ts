import { Instructor } from "./instructor.model";
import { AppointmentStatus } from "../types/appointments-status.enum";

export class Appointment {
    private _id: string;
    private _clientId: string;
    private _instructorId: string;
    private _discipline: string;
    private _dateTime: Date;
    private _status: AppointmentStatus;

    constructor(
        id: string,
        clientId: string,
        instructorId: string,
        discipline: string,
        dateTime: string) {
            const parsedDate = new Date(dateTime);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Data e hora inválidas. Por favor, forneça uma data e hora válidas.');
            }
            
            if (parsedDate.getTime() < Date.now()) {
                throw new Error('Não é possível agendar consultas para datas passadas.');
            }

            if (!clientId || clientId.trim() === '')
                throw new Error('Por favor associar um cliente.');
            if (!instructorId || instructorId.trim() === '')
                throw new Error('Associar instructor é obrigatorio');
            if (!discipline || discipline.trim() === '')
                throw new Error('Disciplina é um campo obrigatorio.');
            
            this._id = id;
            this._clientId = clientId;
            this._instructorId = instructorId;
            this._discipline = discipline;
            this._dateTime = parsedDate;
            this._status = AppointmentStatus.scheduled;    
            }

            get id(): string { return this._id; }
            get clientId(): string {return this._clientId; }
            get instructorId(): string {return this._instructorId; }
            get discipline(): string {return this._discipline; }
            get dateTime(): Date {return this._dateTime; }
            get status(): AppointmentStatus {return this._status; }

            reschedule(newDateTime: string): void {
                const parsedDate = new Date(newDateTime); 
                if (isNaN(parsedDate.getTime())) {
                    throw new Error('Data e hora inválida para reagendamento.');
                }

                if (parsedDate.getTime() < Date.now()) {
                    throw new Error('Não é possível reagendar consultas para datas passadas.');           
                }

                this._dateTime = parsedDate;
                this._status = AppointmentStatus.rescheduled;
            }

            cancel(): void {
                this._status = AppointmentStatus.canceled;
            }
        }
