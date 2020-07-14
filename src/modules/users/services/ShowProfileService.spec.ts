import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

  let fakeUserRepository: FakeUserRepository;
  let showProfileService: ShowProfileService;

describe('UpdateProfileService', () => {
  beforeEach(()=> {
    fakeUserRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Neji',
      email: 'hyuga.neji@konoha.com',
      password: 'byakugan'
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    })

    expect(profile.name).toBe('Neji');
    expect(profile.email).toBe('hyuga.neji@konoha.com');
  });

  it('should not be able to show user profile from non-existing user', async () => {
    await expect(showProfileService.execute({
      user_id: 'zetsu',
    })).rejects.toBeInstanceOf(AppError);
  });

});
