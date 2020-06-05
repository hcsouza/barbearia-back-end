import { hash } from 'bcryptjs';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import User from "@modules/users/infra/typeorm/entities/User";

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  private usersRepository: IUsersRepository;

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository
  ) {
    this.usersRepository = usersRepository;
  }

  public async execute({ name, email, password }: IRequest) : Promise<User> {
    const userExists = await this.usersRepository.findByEmail(email);

    if(userExists){
      throw new AppError('Email address already used.', 409);
    }

    const hashedPassword = await hash(password, 8);
    const user = await this.usersRepository.create({ name, email, password: hashedPassword });
    return user;
  }
}

export default CreateUserService;
