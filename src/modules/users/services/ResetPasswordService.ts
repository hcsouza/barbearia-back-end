import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;
  private userTokensRepository: IUserTokensRepository;

  constructor(
    @inject('UsersRepositoy')
    usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    userTokensRepository: IUserTokensRepository

  ) {
    this.usersRepository = usersRepository;
    this.userTokensRepository = userTokensRepository;
  }

  public async execute({ token, password }: IRequest) : Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if(!userToken) {
      throw new AppError('Token not found.');
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    if(!user) {
      throw new AppError('User not found.');
    }

    await this.usersRepository.save({ ...user, password });
  }

}

export default SendForgotPasswordEmailService;
