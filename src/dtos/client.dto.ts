export interface CreateClientDTO 
{
    name: string;
    email: string;
    age: number;
    address: string;
    cpf: string;
    weight: number;
    educationLevel: string;
    assignedInstructorId?: string;
}

export function isCreateClientDTO(data: unknown): data is CreateClientDTO {
    if (typeof data !== 'object' || data === null) 
        return false;
    const obj = data as Record<string, unknown>; 

    if (typeof obj.name !== 'string' || obj.name.trim() === '') 
        return false;
    
    if (typeof obj.email !== 'string' || !obj.email.includes('@'))
        return false;

    if (typeof obj.age !== 'number' || obj.age <= 0)
        return false;

    if (typeof obj.address !== 'string' || obj.address.trim() === '')
        return false;

    if (typeof obj.cpf !== 'string' || obj.cpf.trim() === '')
        return false;

    if (typeof obj.weight !== 'number' || obj.weight <= 0)
        return false;

    if (typeof obj.educationLevel !== 'string' || obj.educationLevel.trim() === '')
        return false;

    if (obj.assignedInstructorId !== undefined && typeof obj.assignedInstructorId !== 'string') {
        return false;
    } 
    
    return true;
}