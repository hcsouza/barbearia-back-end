import { getRepository, Repository } from 'typeorm';
import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import  ICreateAppointDTO  from "@modules/appointments/dtos/ICreateAppointmentDTO";

import Appointment from '../entities/Appointment';


interface CreateAppointmentDTO {
  provider: string;
  date: Date;
}

class AppointmentRepository implements IAppointmentRepository  {
  private ormRepository: Repository<Appointment>;
  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async appointmentAlreadyBooked(date: Date): Promise<Boolean> {
    const findAppointmentInSameDate = await this.ormRepository.findOne({
      where: { date }
    })
    return findAppointmentInSameDate !== undefined;
  }

  public async create( { provider_id, date} : ICreateAppointDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

export default AppointmentRepository;
