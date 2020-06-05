import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentRepository from "../repositories/IAppointmentsRepository";
import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

interface Request {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentRepository: IAppointmentRepository;

  constructor(
    @inject('AppointmentsRepository')
    appointmentRepository: IAppointmentRepository,
  ) {
    this.appointmentRepository = appointmentRepository;
  }

  public  async execute({ provider_id, date } : Request): Promise<Appointment> {
    const appointmentDate  = startOfHour(date);
    const appointmentAlreadyBooked =  await this.appointmentRepository.appointmentAlreadyBooked(appointmentDate);

    if (appointmentAlreadyBooked) {
      throw new AppError('This appointment is already booked.', 409);
    }

    const appointment = this.appointmentRepository.create({
      provider_id,
      date: appointmentDate
    });
    return appointment;
  }
}

export default CreateAppointmentService;
