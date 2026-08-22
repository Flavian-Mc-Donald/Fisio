export interface CreateAppointmentDTO {
    clientId: string;
    instructorId: string;
    discipline: string;
    dateTime: string;
}

export function isCreateAppointmentDTO(data: unknown): data is CreateAppointmentDTO {
    if (typeof data !== 'object' || data === null ) return false; 
    const obj = data as Record<string, unknown>;
    if (typeof obj.clientId !== 'string' || obj.clientId.trim() === '') return false;
    if (typeof obj.instructorId !== 'string' || obj.instructorId.trim() === '') return false;
    if (typeof obj.discipline !== 'string' || obj.discipline.trim() === '') return false;
    if (typeof obj.dateTime !== 'string' || isNaN(Date.parse(obj.dateTime))) return false;

    return true;
}