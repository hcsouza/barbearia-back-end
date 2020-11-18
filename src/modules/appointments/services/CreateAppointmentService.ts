import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import INotificationRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  private appointmentRepository: IAppointmentRepository;

  private notificationRepository: INotificationRepository;

  private cacheProvider: ICacheProvider;

  constructor(
    @inject('AppointmentsRepository')
    appointmentRepository: IAppointmentRepository,

    @inject('NotificationsRepository')
    notificationRepository: INotificationRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.appointmentRepository = appointmentRepository;
    this.notificationRepository = notificationRepository;
    this.cacheProvider = cacheProvider;
  }

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    const appointmentDate  = startOfHour(date);
    const appointmentAlreadyBooked = await this.appointmentRepository.appointmentAlreadyBooked(
      appointmentDate,
    );

    if (user_id === provider_id){
      throw new AppError("You can't create an appointment for yourself.")
    }

    if (isBefore(appointmentDate, Date.now())){
      throw new AppError("You can't create an appointment on a past date", 409);
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17 ) {
      throw new AppError('An appointment must between 8:00 and 17:00 hours.', 409);
    }

    if (appointmentAlreadyBooked) {
      throw new AppError('This appointment is already booked.', 409);
    }

    const appointment = this.appointmentRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormated = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");
    const cacheKey = `provider-appointments-${provider_id}:${format(
      appointmentDate,
      'yyyy-M-d',
    )}`;

    await this.notificationRepository.create({
      recipient_id: provider_id,
      content: `Novo Agendamento para dia ${dateFormated}`,
    });

    await this.cacheProvider.invalidate(cacheKey);

    return appointment;
  }
}

export default CreateAppointmentService;
