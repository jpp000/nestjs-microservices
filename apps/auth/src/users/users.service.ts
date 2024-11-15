import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Role, User } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUser: CreateUserDto) {
    await this.validateCreateUser(createUser);
    const user = new User({
      ...createUser,
      password: await bcrypt.hash(createUser.password, 10),
      roles: createUser.roles.map((roleDto) => new Role(roleDto)),
    });
    return this.usersRepository.create(user);
  }

  private async validateCreateUser(createUser: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUser.email });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists.');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async getUser(getUser: GetUserDto) {
    return this.usersRepository.findOne(getUser, { roles: true });
  }

  async getAllUsers() {
    return this.usersRepository.find({});
  }
}
