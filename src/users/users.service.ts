import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  async create(data: CreateUserDto) {
    return {
      id: 'uuid-placeholder',
      name: data.name,
      email: data.email,
    };
  }
}
