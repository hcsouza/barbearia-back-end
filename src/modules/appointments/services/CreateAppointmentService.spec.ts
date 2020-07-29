import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';

  let fakeAppointmentRepository: FakeAppointmentRepository;
  let fakeNotificationRepository: FakeNotificationsRepository;
  let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationRepository = new FakeNotificationsRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationRepository
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: '123',
      provider_id: '123123123'
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123123');
  });

  it('should not be able to create two appointments in same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 8).getTime();
    });

    const appointmentDate =  new Date(2020, 4, 10, 11);
    await createAppointment.execute({
      date: appointmentDate,
      user_id: '123',
      provider_id: '123123123'
    });

    await expect(createAppointment.execute({
        date: appointmentDate,
        user_id: '123',
        provider_id: '321321321'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: '123',
        provider_id: '321321321'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user and provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 13).getTime();
    });

    await expect(createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: '123',
        provider_id: '123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });


  it('should not be able to create an appointment out of range 8:00 and 17:00 hours', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
        date: new Date(2020, 4, 10, 7),
        user_id: '123123',
        provider_id: '123'
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
        date: new Date(2020, 4, 10, 18),
        user_id: '123123',
        provider_id: '123'
      })
    ).rejects.toBeInstanceOf(AppError);

  });

});
