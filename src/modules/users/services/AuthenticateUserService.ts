import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import User from "@modules/users/infra/typeorm/entities/User";
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { hash } from 'bcryptjs';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  private usersRepository: IUsersRepository;
  private hashProvider: IHashProvider;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('HashProvider')
    hashProvider: IHashProvider
  ) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async execute({ email, password}:IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if(!user){
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if(!passwordMatched){
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const token = sign({},
                      authConfig.jwt.secret,
                      {
                        subject: user.id,
                        expiresIn: authConfig.jwt.expired_in,
                      }
    )

    return { user, token};
  }
}

export default AuthenticateUserService;
