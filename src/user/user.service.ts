import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import * as bcrypt from 'bcryptjs';
import { UserPayload } from './interfaces/user.payload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.name', 'u.email'])
      .getMany();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async createUser(dto: CreateUserDto): Promise<UserPayload> {
    const isUserExist = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (isUserExist) {
      throw new BadRequestException(
        'Пользователь с данным email уже существует!',
      );
    }

    const user = await this.userRepository.create(dto);

    const hashPassword = await bcrypt.hash(dto.password, 12);

    const savedUser = await this.userRepository.save({
      ...user,
      password: hashPassword,
    });

    return (({ password, ...userData }) => userData)(savedUser);
  }
}
