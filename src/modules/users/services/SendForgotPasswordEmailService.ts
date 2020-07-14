import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import path from 'path';

import IMailProvider from '../../../shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private mailProvider: IMailProvider;
  private usersRepository: IUsersRepository;
  private userTokensRepository: IUserTokensRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('MailProvider')
    mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    userTokensRepository: IUserTokensRepository

  ) {
    this.mailProvider = mailProvider;
    this.usersRepository = usersRepository;
    this.userTokensRepository = userTokensRepository;
  }

  public async execute({ email }: IRequest) : Promise<void> {

    const user = await this.usersRepository.findByEmail(email);

    if(!user) {
      throw new AppError('User not found');
    }
    const userToken = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] - Reset Password',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${userToken.token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
