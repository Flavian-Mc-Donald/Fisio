import { Request, Response } from 'express';
import { InstructorService } from '../services/instructor.service';
import { isCreateInstructorDTO } from '../dtos/instructor.dto';

export class InstructorController {
  constructor(private instructorService: InstructorService) {}

  create = async (req: Request<{id : string}>, res: Response): Promise<void> => {
    try {
      const payload = req.body;

      if (!isCreateInstructorDTO(payload)) {
        res.status(400).json({
          error: 'Erro de validação. Por favor, forneça todos os dados do instrutor com CPF, Especialidades e CREFITO corretos.'
        });
        return;
      }

      const instructor = await this.instructorService.create(payload);
      res.status(201).json(instructor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  findById = async (req: Request <{id:string}>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const instructor = await this.instructorService.findById(id);
      res.status(200).json(instructor);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

   findAll = async(req: Request <{id:string}>, res: Response): Promise<void> => {
    try {
      const instructors = await this.instructorService.findAll();
      res.status(200).json(instructors);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  update = async (req: Request <{id:string}>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const payload = req.body;

      const updated = await this.instructorService.update(id, payload);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async(req: Request <{id:string}>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.instructorService.delete(id);
      res.status(200).json({ success: result, message: 'Instrutor removido com sucesso.' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}