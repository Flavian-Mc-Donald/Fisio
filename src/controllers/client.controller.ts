import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';
import { isCreateClientDTO } from '../dtos/client.dto';

export class ClientController {
  constructor(private clientService: ClientService) {}

create = async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = req.body;

      if (!isCreateClientDTO(payload)) {
        res.status(400).json({
          error: 'Erro de validação. Por favor, forneça todos os dados obrigatórios com os tipos corretos.'
        });
        return;
      }

      const client = await this.clientService.create(payload);
      res.status(201).json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  findById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const requestingUserId = req.userId!;
      const requestingUserRole = req.role!;

      const client = await this.clientService.findById(id, requestingUserId, requestingUserRole);
      res.status(200).json(client);
    } catch (error: any) {
      if (error.message.includes('Acesso negado')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(404).json({ error: error.message });
      }
    }
  }

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const requestingUserId = req.userId!;
      const requestingUserRole = req.role!;

      const clients = await this.clientService.findAll(requestingUserId, requestingUserRole);
      res.status(200).json(clients);
    } catch (error: any) {
      if (error.message.includes('Acesso negado')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  update = async(req: Request<{ id: string}>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const payload = req.body;
      const requestingUserId = req.userId!;
      const requestingUserRole = req.role!;

      const updatedClient = await this.clientService.update(
        id,
        payload,
        requestingUserId,
        requestingUserRole
      );
      res.status(200).json(updatedClient);
    } catch (error: any) {
      if (error.message.includes('Acesso negado')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  delete = async(req: Request<{ id: string}>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.clientService.delete(id);
      res.status(200).json({ success: result, message: 'Cliente removido com sucesso.' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}