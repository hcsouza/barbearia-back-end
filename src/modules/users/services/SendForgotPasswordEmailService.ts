import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import IMailProvider from '../providers/MailProvider/models/IMailProvider';
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
    @inject('UsersRepositoy')
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
    await this.mailProvider.sendMail(email, `Token: ${userToken.token}`);
  }
}

export default SendForgotPasswordEmailService;
