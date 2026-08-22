import { Instructor } from '../models/instructor.model';

export abstract class InstructorRepository {
    abstract save(instructor: Instructor): Promise<Instructor>;
    abstract findById(id: string): Promise<Instructor | null>;
    abstract findByEmail(email: string): Promise<Instructor | null>;
    abstract findAll(): Promise<Instructor[]>;
    abstract delete(id: string): Promise<boolean>;    
    }

    export class InstructorRepositoryMemory extends InstructorRepository {
        private static instructors: Instructor[] = [];

        async save(instructor: Instructor): Promise<Instructor> {
            const index = InstructorRepositoryMemory.instructors.findIndex(i => i.id === instructor.id);
            if (index >= 0) {
                InstructorRepositoryMemory.instructors[index] = instructor;
            } else {
                InstructorRepositoryMemory.instructors.push(instructor);
            }
            return instructor;
            }

        async findById(id: string): Promise<Instructor | null> {
            const instructor = InstructorRepositoryMemory.instructors.find(i => i.id === id);
            return instructor || null;            
        }

        async findByEmail(email: string): Promise<Instructor | null> {
            const instructor = InstructorRepositoryMemory.instructors.find(i => i.email.toLowerCase() === email.toLowerCase());
            return instructor || null;
        }
            
        async findAll(): Promise<Instructor[]> {
            return [...InstructorRepositoryMemory.instructors];
        }

        async delete(id: string): Promise<boolean> {
            const index = InstructorRepositoryMemory.instructors.findIndex(i => i.id === id);
            if (index >= 0) {
                InstructorRepositoryMemory.instructors.splice(index, 1);
                return true;
            }
            return false;
        }
        static clear(): void{
            InstructorRepositoryMemory.instructors = [];
        }
    }