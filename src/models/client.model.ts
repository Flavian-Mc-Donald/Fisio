import { UserRole } from '../types/roles.enum';

export class Client {
    private _id: string;
    private _name: string;
    private _email: string; 
    private _age: number;
    private _address: string;
    private _cpf: string; 
    private _weight: number; 
    private _educationLevel: string;
    private _assignedInstructorId: string; 
    private _role: UserRole;

    constructor(
        id: string,
        name: string,
        email: string,
        age: number,
        address: string,
        cpf: string, 
        weight: number,
        educationLevel: string,
        assignedInstructorId?: string
    )   {
        if (!name || name.trim() === '') {
            throw new Error ('O nome do cliente é obrigatório, por gentileza forneça-o.');
        }
        if (!email || !email.includes('@')) {
            throw new Error ('O email do cliente é obrigatório e deve ser válido, por gentileza facilite-o.');
        }
        if (age <=0 || age >= 110) {
            throw new Error ('Por favor insira uma idade válida');
        }
        if (!address || address.trim() === '') {
            throw new Error ('Adicione as informações de endereço por favor');
        }
        if (!cpf || cpf.trim() === '') {
            throw new Error ('O CPF do cliente é obrigatório, por gentileza supra-o.');
        }
        if (weight <=0 || weight >= 260) {
            throw new Error ('Por favor insira um peso válido, entre 0 e 260 kg');
        }
        if (!educationLevel || educationLevel.trim() === '') {
            throw new Error ('O nível de escolaridade do cliente é obrigatório, por gentileza disponibilize-o.');
        }

        this._id = id;
        this._name = name;
        this._email = email;
        this._age = age;
        this._address = address;
        this._cpf = cpf;
        this._weight = weight;
        this._educationLevel = educationLevel;
        this._assignedInstructorId = assignedInstructorId || '';
        this._role = UserRole.CLIENT;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get age(): number {
        return this._age;
    }

    get address(): string {
        return this._address;
    }

    get cpf(): string {
        return this._cpf;
    }

    get weight(): number {
        return this._weight;
    }

    get educationLevel(): string {
        return this._educationLevel;
    }

    get assignedInstructorId(): string {
        return this._assignedInstructorId;
    }

    get role(): UserRole {
        return this._role;
    }

    set name(newName: string) {
        if (!newName || newName.trim() === '') {
            throw new Error('O nome do cliente deve conter informações.');
        }
        this._name = newName;
    }

    set email(newEmail: string) {
        if (!newEmail || !newEmail.includes('@')) {
            throw new Error('O email do cliente precisa ser válido.');
        }
        this._email = newEmail;
    }

    set age (newAge: number) {
        if (newAge <=0 || newAge >= 110) {
            throw new Error('Por favor insira uma idade válida');
        }
        this._age = newAge;
    }

    set address(newAddress: string) {
        if (!newAddress || newAddress.trim() === '') {
            throw new Error('O endereço não pode estar vazio, por gentileza forneça um endereço válido.');
        }
        this._address = newAddress;
    }

    set cpf(newCpf: string) {
        if (!newCpf || newCpf.trim() === '') {
            throw new Error('O numero de CPF é obrigatório');
        }
        this._cpf = newCpf;
    }

    set weight(newWeight: number) {
        if (newWeight <=0 || newWeight >= 260) {
            throw new Error('Por favor insira um peso válido, entre 0 e 260 kg');
        }
        this._weight = newWeight;
    }

    set educationLevel(newEducationLevel: string) {
        if (!newEducationLevel || newEducationLevel.trim() === '') {
            throw new Error('O campo de escolaridade é obrigatório');
        }
        this._educationLevel = newEducationLevel;
    }
    set assignedInstructorId(newAssignedInstructorId: string) {
        this._assignedInstructorId = newAssignedInstructorId;
    }
}
