import { getRepository  } from 'typeorm';
import User from "../models/User";
import { hash } from 'bcryptjs';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }:Request) : Promise<User> {
    const repository = getRepository(User);
    const userExists = await repository.findOne({
      where: { email }
    });

    if(userExists){
      throw new AppError('Email address already used.', 409);
    }

    const hashedPassword = await hash(password, 8);
    const user = repository.create({ name, email, password: hashedPassword });
    return await repository.save(user);
  }
}

export default CreateUserService;
