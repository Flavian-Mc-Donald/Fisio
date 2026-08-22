import { UserRole } from '../types/roles.enum';

export class Instructor {
    private _id: string;
    private _name: string;
    private _email: string;
    private _cpf: string;
    private _specialties: string[];
    private _crefito: number;
    private _role: UserRole;

    constructor(
        id: string, 
        name: string,
        email: string,
        cpf: string,
        specialties: string[],
        crefito: number) {

            if (!name || name.trim() === '') {
                throw new Error ('O nome do instrutor é obrigatório.');
            }

            if (!email || !email.includes('@')) {
                throw new Error ('O email do instrutor é obrigatório e deve ser válido.');
            }

            if (!cpf || cpf.trim() === '') {
            throw new Error ('O CPF do instrutor é obrigatório.');
            }
            
            if (!specialties || specialties.length === 0) {
                throw new Error ('Instrutor(a) deve possuir ao menos uma especialidade.');
            }

            if (crefito <= 0) {
                throw new Error ('O número do CREFITO do instrutor é obrigatório e deve ser válido.');
            }
        this._id = id;
        this._name = name;
        this._email = email;
        this._cpf = cpf;
        this._specialties = specialties;
        this._crefito = crefito;
        this._role = UserRole.INSTRUCTOR;
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get email(): string { return this._email; }
    get cpf(): string { return this._cpf; }
    get specialties(): string[] { return [...this._specialties]; }
    get crefito(): number { return this._crefito; }
    get role(): UserRole { return this._role; }

    set name(newName: string) {
        if (!newName || newName.trim() === '') {
            throw new Error ('O nome do instrutor é obrigatório.');
        }
        this._name = newName;
    }

    set email(newEmail: string) { 
        if (!newEmail || !newEmail.includes('@')) {
            throw new Error ('o Email do instrutor é invalido, por favor corregir.');
        }
        this._email = newEmail;        
    }

    set cpf(newCpf: string) {
        if (!newCpf || newCpf.trim() === '') {
            throw new Error('O numero de CPF é obrigatório');
        }
        this._cpf = newCpf;
    }

    set specialties(newSpecialties: string[]) {
        if (!newSpecialties || newSpecialties.length === 0) {
            throw new Error('As especialidades do profissional são obrigatórias, pelo menos uma.');   
        }
        this._specialties = newSpecialties;
    }

    set crefito(newCrefito: number) {
        if (newCrefito <= 0) {
            throw new Error('O número do CREFITO do instrutor é obrigatório e deve ser válido.');
        }
        this._crefito = newCrefito;
    }

}