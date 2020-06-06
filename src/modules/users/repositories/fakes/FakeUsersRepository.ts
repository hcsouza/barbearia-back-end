
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import  ICreateUserDTO  from "@modules/users/dtos/ICreateUserDTO";
import { uuid } from 'uuidv4';

import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository  {
  private users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(
      user => user.email === email
    )
    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(
      user => user.id === id
    )
    return findUser;
  }

  public async create({email, name, password }: ICreateUserDTO): Promise<User>{
    const user = new User();
    Object.assign(user, { id: uuid(), email, name, password  });
    this.users.push(user);
    return user;
  }

  public async save(user: User):Promise<User> {
    const indexUser = this.users.findIndex(
      user => user.id === user.id
    )
    if(indexUser > -1) {
      this.users[indexUser] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }
}

export default FakeUsersRepository;
