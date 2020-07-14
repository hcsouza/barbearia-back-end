import FakeMailProvider from '../../../shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordService from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';


let fakeMailProvider: FakeMailProvider;
let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordService: SendForgotPasswordService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordService = new SendForgotPasswordService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it('should be able to recover his password with email', async () => {

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    fakeUserRepository.create({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin'
    })

    await sendForgotPasswordService.execute({
      email: 'minato@konoha.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a password from inexistent user', async () => {

    await expect(sendForgotPasswordService.execute({
      email: 'minato@konoha.com',
    })).rejects.toBeInstanceOf(AppError);

  });

  it('should generate a forgot password token', async () => {

    const sendForgotPasswordEmail = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUserRepository.create({
      email: 'minato@konoha.com',
      name: 'Minato',
      password: 'hiraishin'
    })

    await sendForgotPasswordService.execute({
      email: 'minato@konoha.com',
    });

    expect(sendForgotPasswordEmail).toHaveBeenCalledWith(user.id);
  });

});
