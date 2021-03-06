import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeHashProvider: FakeHashProvider;
let fakeUserRepository: FakeUserRepository;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with existent email', async () => {
    await createUserService.execute({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin',
    });

    await expect(
      createUserService.execute({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
