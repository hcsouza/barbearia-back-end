import Appointment from "../models/Appointment";
import appointmentRouter from "../routes/appointments.routes";
import AppointmentRepository from "../repositories/AppointmentRepository";
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {

  public  async execute({ provider_id, date } : Request): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentRepository);
    const appointmentDate  = startOfHour(date);
    const appointmentAlreadyBooked =  await repository.appointmentAlreadyBooked(appointmentDate);

    if (appointmentAlreadyBooked) {
      throw new AppError('This appointment is already booked.', 409);
    }

    const appointment = repository.create({
      provider_id,
      date: appointmentDate
    });

    await repository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
