import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import  ICreateAppointDTO  from "@modules/appointments/dtos/ICreateAppointmentDTO";
import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import Appointment from '../../infra/typeorm/entities/Appointment';


class FakeAppointmentRepository implements IAppointmentRepository  {
  private appointments: Appointment[] = [];

  public async appointmentAlreadyBooked(date: Date): Promise<Boolean> {
    const findAppointment = this.appointments.find(
      appointment => isEqual(appointment.date, date)
    );

    return findAppointment !== undefined;

  }

  public async create( { provider_id, date} : ICreateAppointDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id });
    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointmentRepository;
