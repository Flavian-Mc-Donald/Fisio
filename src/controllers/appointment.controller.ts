import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointment.service';
import { isCreateAppointmentDTO } from '../dtos/appointment.dto';

export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  create = async(req: Request, res: Response): Promise<void> => {
    try {
      const payload = req.body;
      const requestingUserId = req.userId!;
      const requestingUserRole = req.role!;

      if (!isCreateAppointmentDTO(payload)) {
        res.status(400).json({
          error: 'Erro de validação. Por favor, preencha todos os campos do agendamento com data/hora em formato ISO.'
        });
        return;
      }

      const appointment = await this.appointmentService.create(
        payload,
        requestingUserId,
        requestingUserRole
      );
      res.status(201).json(appointment);
    } catch (error: any) {
      if (error.message.includes('Acesso negado')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  reschedule = async (req: Request <{id:string}>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { dateTime } = req.body;
      const requestingUserId = req.userId!;
      const requestingUserRole = req.role!;

      if (!dateTime || isNaN(Date.parse(dateTime))) {
        res.status(400).json({
          error: 'Erro de validação. É necessário enviar um campo "dateTime" válido para a remarcação.'
        });
        return;
      }

      const updated = await this.appointmentService.reschedule(
        id,
        dateTime,
        requestingUserId,
        requestingUserRole
      );
      res.status(200).json(updated);
    } catch (error: any) {
      if (error.message.includes('Acesso negado')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  cancel = async (req: Request <{id:string}>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const requestingUserId = req.userId!;
      const requestingUserRole = req.role!;

      const canceled = await this.appointmentService.cancel(id, requestingUserId, requestingUserRole);
      res.status(200).json(canceled);
    } catch (error: any) {
      if (error.message.includes('Acesso negado')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  findById = async (req: Request <{id:string}>, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const requestingUserId = req.userId!;
      const requestingUserRole = req.role!;

      const appointment = await this.appointmentService.findById(id, requestingUserId, requestingUserRole);
      res.status(200).json(appointment);
    } catch (error: any) {
      if (error.message.includes('Acesso negado')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(404).json({ error: error.message });
      }
    }
  }

  findAll = async (req: Request <{id:string}>, res: Response): Promise<void> => {
    try {
      const requestingUserId = req.userId!;
      const requestingUserRole = req.role!;

      const appointments = await this.appointmentService.findAll(requestingUserId, requestingUserRole);
      res.status(200).json(appointments);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}