import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProvider from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProvider from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  appointmentAlreadyBooked(date: Date): Promise<Boolean>;
  findAllInMonthFromProvider(data: IFindAllInMonthFromProvider): Promise<Appointment[]>;
  findAllInDayFromProvider(data: IFindAllInDayFromProvider): Promise<Appointment[]>;
}
