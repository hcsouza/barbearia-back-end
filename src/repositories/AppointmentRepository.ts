import Appointment from '../models/Appointment';
import { EntityRepository, Repository } from 'typeorm';

interface CreateAppointmentDTO {
  provider: string;
  date: Date;
}

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {

  public async appointmentAlreadyBooked(date: Date): Promise<Boolean> {
    const findAppointmentInSameDate = await this.findOne({
      where: { date }
    })
    return findAppointmentInSameDate !== undefined;
  }
}

export default AppointmentRepository;
