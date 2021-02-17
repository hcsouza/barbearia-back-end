import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import IFindAllInMonthFromProvider from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProvider from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import Appointment from '../entities/Appointment';

class AppointmentRepository implements IAppointmentRepository  {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async appointmentAlreadyBooked(date: Date, provider_id: string): Promise<boolean> {
    const findAppointmentInSameDate = await this.ormRepository.findOne({
      where: { date, provider_id }
    })
    return findAppointmentInSameDate !== undefined;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProvider): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    })
    return appointments;
  }

  public async findAllInDayFromProvider({provider_id, day, month, year }: IFindAllInDayFromProvider): Promise<Appointment[]>{
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(dateFieldName =>
          `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
    })
    return appointments;
  }

  public async create( { user_id, provider_id, date} : ICreateAppointDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentRepository;
