import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Token } from '../token/entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserPayload } from '../user/interfaces/user.payload.interface';
import { Jwt } from './interfaces/jwt.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: AuthDto): Promise<Jwt> {
    const user = await this.validateUser(dto);
    const refreshToken = await this.tokenRepository.findOne({
      where: { userId: user.id },
    });
    const tokens = await this.issueTokens({
      ...user,
    });

    refreshToken
      ? await this.tokenRepository.update(
          { id: refreshToken.id },
          { refreshToken: tokens.refreshToken, userId: user.id },
        )
      : await this.tokenRepository.insert({
          refreshToken: tokens.refreshToken,
          userId: user.id,
        });

    return {
      ...tokens,
    };
  }

  async registration(dto: CreateUserDto): Promise<Jwt> {
    const candidate = await this.userService.getUserByEmail(dto.email);

    if (candidate)
      throw new BadRequestException(
        'Пользователь с данным email уже зарегистрирован!',
      );

    const user = await this.userService.createUser({
      ...dto,
    });
    const tokens = await this.issueTokens(user);

    await this.tokenRepository.insert({
      refreshToken: tokens.refreshToken,
      userId: user.id,
    });

    return {
      ...tokens,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const token = await this.tokenRepository.findOneBy({ refreshToken });

    if (!token)
      throw new UnauthorizedException({ message: 'Некорректный токен!' });

    await this.tokenRepository.delete({ refreshToken });
  }

  async refresh(refreshToken: string): Promise<Jwt> {
    const token = await this.tokenRepository.findOneBy({ refreshToken });

    if (!token)
      throw new UnauthorizedException({ message: 'Некорректный токен!' });

    const user = await this.userService.getUserById(token.userId);
    const tokens = await this.issueTokens(user);

    token
      ? await this.tokenRepository.update(
          { id: token.id },
          { refreshToken: tokens.refreshToken, userId: user.id },
        )
      : await this.tokenRepository.insert({
          refreshToken: tokens.refreshToken,
          userId: user.id,
        });

    return {
      ...tokens,
    };
  }

  private async issueTokens(payload: UserPayload): Promise<Jwt> {
    const jwtRefreshExpires = this.configService.get('JWT_REFRESH_EXPIRES');

    const accessToken = this.jwtService.sign({ ...payload });

    const refreshToken = this.jwtService.sign(
      { ...payload },
      {
        expiresIn: jwtRefreshExpires,
      },
    );

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto): Promise<User> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Некорректное имя пользователя или пароль!',
      });
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({
      message: 'Некорректное имя пользователя или пароль!',
    });
  }
}
