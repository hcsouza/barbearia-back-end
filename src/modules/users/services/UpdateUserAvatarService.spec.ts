import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

  let fakeUserRepository: FakeUserRepository;
  let fakeStorageProvider: FakeStorageProvider;
  let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(()=> {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider
    );

  });

  it('should be able to update avatar user file', async () => {
    const user = await fakeUserRepository.create({
      name: 'Neji',
      email: 'hyuga.neji@konoha.com',
      password: 'byakugan'
    });

    const userUpdated = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });

    expect(user.avatar).toBe('avatar.jpg');
  });


  it('should not be able to update avatar file of an inexistent user', async () => {
    await expect(updateUserAvatarService.execute({
      user_id: 'hidan',
      avatarFilename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should delete previous avatar file when user has one', async () => {
    const deleteFileSpy = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'Neji',
      email: 'hyuga.neji@konoha.com',
      password: 'byakugan'
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg'
    });

    expect(deleteFileSpy).toHaveBeenCalledWith('avatar.jpg')
  });


});
