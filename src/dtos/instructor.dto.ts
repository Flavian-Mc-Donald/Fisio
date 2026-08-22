export interface CreateInstructorDTO {
    name: string;
    email: string;
    cpf: string;
    specialties: string[];
    crefito: number;
}

export function isCreateInstructorDTO(data: unknown): data is CreateInstructorDTO {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    if (typeof obj.name !== 'string' || obj.name.trim() === '') return false;
    if (typeof obj.email !== 'string' || !obj.email.includes('@')) return false;
    if (typeof obj.cpf !== 'string' || obj.cpf.trim() === '') return false;
    if (!Array.isArray(obj.specialties)) return false; 
    if (obj.specialties.some(s => typeof s !== 'string' || s.trim() === '')) return false;
    if (typeof obj.crefito !== 'number' || obj.crefito <= 0) return false;
    
    return true;
}