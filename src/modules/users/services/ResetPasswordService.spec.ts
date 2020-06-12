import FakeMailProvider from '../providers/MailProvider/fakes/FakeMailProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import AppError from '@shared/errors/AppError';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';


let fakeMailProvider: FakeMailProvider;
let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to reset the password', async () => {

    const user = await fakeUserRepository.create({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPasswordService.execute({
      password: 'Rasengan',
      token,
    });

    const updateUser = await fakeUserRepository.findById(user.id);

    expect(updateUser?.password).toBe('Rasengan');
  });

  it('should not be able to reset the password when token is invalid', async () => {

    const user = await fakeUserRepository.create({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin'
    })

    await expect(resetPasswordService.execute({
      password: 'Rasengan',
      token: '7ccd',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password when user not found', async () => {

    const user = await fakeUserRepository.create({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await fakeUserRepository.delete(user);

    await expect(resetPasswordService.execute({
      password: 'Rasengan',
      token: token,
    })).rejects.toBeInstanceOf(AppError);

  });

});
