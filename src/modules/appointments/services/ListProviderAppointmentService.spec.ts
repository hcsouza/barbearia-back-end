import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentService from './ListProviderAppointmentService';

  let fakeAppointmentRepository: FakeAppointmentRepository;
  let listProviderAppointmentService : ListProviderAppointmentService;

describe('ListProviderAppointmentService', () => {
  beforeEach(()=> {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderAppointmentService = new ListProviderAppointmentService(
      fakeAppointmentRepository
    );
  });

  it('should be able to list appointments on day for provider', async () => {
    const appointment1 = await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 3, 20, 8, 0, 0),
    });

    const appointment2 = await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 3, 20, 9, 0, 0),
    });


    const appointments = await listProviderAppointmentService.execute({
      provider_id: 'user',
      year: 2020,
      month: 4,
      day: 20
    });

    expect(appointments).toEqual([appointment1, appointment2])
  });
});
