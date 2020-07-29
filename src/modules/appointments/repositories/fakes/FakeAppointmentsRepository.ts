import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import  ICreateAppointDTO  from "@modules/appointments/dtos/ICreateAppointmentDTO";
import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import Appointment from '../../infra/typeorm/entities/Appointment';
import IFindAllInMonthFromProvider from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProvider from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';


class FakeAppointmentRepository implements IAppointmentRepository  {
  private appointments: Appointment[] = [];

  public async appointmentAlreadyBooked(date: Date): Promise<Boolean> {
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date, date)
    );

    return findAppointment !== undefined;
  }

  public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthFromProvider): Promise<Appointment[]>{
    const findAppointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
     });
     return findAppointments;
  }

  public async findAllInDayFromProvider({ provider_id, day, month, year  }: IFindAllInDayFromProvider): Promise<Appointment[]>{
    const findAppointments = this.appointments.filter(appointment => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year
      );
     });
     return findAppointments;

  }

  public async create( {user_id, provider_id, date} : ICreateAppointDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });
    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentRepository;
