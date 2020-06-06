
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AutenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

describe('AuthenticateUserService', () => {

  it('should be able to authenticate on app', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUser = new AutenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    const user = await createUserService.execute({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin'
    });

    const response  = await authenticateUser.execute({
      email: 'minato@konoha.com',
      password: 'hiraishin'
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate on system with incorrect email', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUser = new AutenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    await createUserService.execute({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin'
    });

    expect(authenticateUser.execute({
      email: 'minato@konoha.com',
      password: 'neji'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate on system without created user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const authenticateUser = new AutenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    expect(authenticateUser.execute({
      email: 'minato@konoha.com',
      password: 'neji'
    })).rejects.toBeInstanceOf(AppError);
  });


});
