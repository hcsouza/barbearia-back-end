import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import  User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
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
  public async execute({ user_id, name, email, password, old_password}: IRequest) : Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if(!user){
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id){
      throw new AppError('Cannot use an used email')
    }

    if(password && !old_password){
      throw new AppError('To change password the oldpassword is mandatory');
    }

    if(password && old_password){
      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError('To change password the oldpassword is mandatory');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    user.email = email;
    user.name = name;

    return await this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
