
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AutenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

  let fakeUserRepository: FakeUserRepository;
  let fakeHashProvider: FakeHashProvider;
  let authenticateUser: AutenticateUserService;
  let createUserService: CreateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(()=>{
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AutenticateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider
    );

  });

  it('should be able to authenticate on app', async () => {
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
    expect(authenticateUser.execute({
      email: 'minato@konoha.com',
      password: 'neji'
    })).rejects.toBeInstanceOf(AppError);
  });


});
