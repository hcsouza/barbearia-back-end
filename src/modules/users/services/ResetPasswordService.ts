import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository;
  private userTokensRepository: IUserTokensRepository;
  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    hashProvider: IHashProvider

  ) {
    this.usersRepository = usersRepository;
    this.userTokensRepository = userTokensRepository;
    this.hashProvider = hashProvider;
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

    const compareDate =  addHours(userToken.created_at, 2);

    if(isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }

}

export default SendForgotPasswordEmailService;
