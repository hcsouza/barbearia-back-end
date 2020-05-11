import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentRepository from '../repositories/AppointmentRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import { getCustomRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentRouter = Router();
appointmentRouter.use(ensureAuthenticated);

appointmentRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentRepository);
  return response.json(await repository.find());
});

appointmentRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;
  const parsedDate = parseISO(date);
  const createAppointmentService = new CreateAppointmentService();
  const appointment =  await createAppointmentService.execute({ provider_id, date: parsedDate });
  return response.json(appointment);
});

export default appointmentRouter;
