import { Client } from '../models/client.model';

export abstract class ClientRepository {
    abstract save(client: Client): Promise<Client>;
    abstract findById(id: string): Promise<Client | null>;
    abstract findByEmail(email: string): Promise<Client | null>;
    abstract findAll(): Promise<Client[]>;
    abstract delete(id: string): Promise<boolean>;
}

export class ClientRepositoryMemory extends ClientRepository {
    private static clients: Client[] = [];

    async save(client: Client): Promise<Client> {
        const index = ClientRepositoryMemory.clients.findIndex(c => c.id === client.id);
        if (index >= 0) {
            ClientRepositoryMemory.clients[index] = client;
        } else {
            ClientRepositoryMemory.clients.push(client);
        }
        return client;
    }

    async findById(id: string): Promise<Client | null> {
        const client = ClientRepositoryMemory.clients.find(c => c.id === id);
        return client || null;
    }

    async findByEmail(email: string): Promise<Client | null> {
        const client = ClientRepositoryMemory.clients.find(c => c.email.toLowerCase() === email.toLowerCase());
        return client || null;
    }

    async findAll(): Promise<Client[]> {
        return [...ClientRepositoryMemory.clients];
    }

    async delete(id: string): Promise<boolean> {
        const index = ClientRepositoryMemory.clients.findIndex(c => c.id === id);
        if (index >= 0) {
            ClientRepositoryMemory.clients.splice(index, 1);
            return true;
        }
        return false;
    }

    static clear(): void {
        ClientRepositoryMemory.clients = [];
       } 
    }