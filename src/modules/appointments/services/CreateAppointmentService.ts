import Appointment from "../infra/typeorm/entities/Appointment";
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import IAppointmentRepository from "../repositories/IAppointmentsRepository";
import INotificationRepository from '@modules/notifications/repositories/INotificationsRepository';

interface Request {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentRepository: IAppointmentRepository;
  private notificationRepository: INotificationRepository;

  constructor(
    @inject('AppointmentsRepository')
    appointmentRepository: IAppointmentRepository,

    @inject('NotificationsRepository')
    notificationRepository: INotificationRepository,
  ) {
    this.appointmentRepository = appointmentRepository;
    this.notificationRepository = notificationRepository;
  }

  public  async execute({ provider_id, user_id, date } : Request): Promise<Appointment> {
    const appointmentDate  = startOfHour(date);
    const appointmentAlreadyBooked =  await this.appointmentRepository.appointmentAlreadyBooked(appointmentDate);

    if(user_id === provider_id){
      throw new AppError("You can't create an appointment for yourself.")
    }

    if(isBefore(appointmentDate, Date.now())){
      throw new AppError("You can't create an appointment on a past date", 409);
    }

    if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17 ) {
      throw new AppError('An appointment must between 8:00 and 17:00 hours.', 409);
    }

    if (appointmentAlreadyBooked) {
      throw new AppError('This appointment is already booked.', 409);
    }

    const appointment = this.appointmentRepository.create({
      provider_id,
      user_id,
      date: appointmentDate
    });

    const dateFormated =  format(appointmentDate, "dd/MM/yyyy 'às' HH:mm")
    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo Agendamento para dia ${dateFormated}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
