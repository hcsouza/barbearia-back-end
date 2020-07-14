
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(()=> {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider
    );

  });

  it('should be able to update user profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Neji',
      email: 'hyuga.neji@konoha.com',
      password: 'byakugan'
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Rock lee',
      email: 'rocklee@konoha.com',
    })

    expect(updatedUser.name).toBe('Rock lee');
    expect(updatedUser.email).toBe('rocklee@konoha.com');
  });

  it('should not be able to update user profile from non-existing user', async () => {
    await expect(updateProfileService.execute({
      user_id: 'zetsu',
      email: 'zetsu@outsuki.com',
      name: 'zetsu',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    const user = await fakeUserRepository.create({
      name: 'Neji',
      email: 'hyuga.neji@konoha.com',
      password: 'byakugan'
    });

    await fakeUserRepository.create({
      name: 'Rock fake',
      email: 'rocklee@konoha.com',
      password: 'eight gates'
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Rock lee',
      email: 'rocklee@konoha.com',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Neji',
      email: 'hyuga.neji@konoha.com',
        password: 'byakugan',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Rock lee',
      email: 'rocklee@konoha.com',
      old_password: 'byakugan',
      password: 'eightGates',
    })

    expect(updatedUser.password).toBe('eightGates');
  });

  it('should not be able to update the password without oldPassword', async () => {
    const user = await fakeUserRepository.create({
      name: 'Neji',
      email: 'hyuga.neji@konoha.com',
      password: 'byakugan'
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Rock lee',
      email: 'rocklee@konoha.com',
      password: 'eightGates',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong oldPassword', async () => {
    const user = await fakeUserRepository.create({
      name: 'Neji',
      email: 'hyuga.neji@konoha.com',
      password: 'byakugan'
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'Rock lee',
      email: 'rocklee@konoha.com',
      old_password: 'eightGates',
      password: 'eightGates',
    })).rejects.toBeInstanceOf(AppError);
  });

});
