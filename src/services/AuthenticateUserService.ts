import { getRepository  } from 'typeorm';
import User from "../models/User";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password}:Request): Promise<Response> {
    const repository = getRepository(User);
    const user = await repository.findOne({ where: { email } });

    if(!user){
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await compare(password, user.password);

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
