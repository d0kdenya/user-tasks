import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/create.user.dto';
import { RefreshToken } from '../token/decorators/refresh-token.decorator';
import { Jwt } from './interfaces/jwt.interface';
import { UserPayload } from '../user/interfaces/user.payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Вход!' })
  @HttpCode(200)
  @Post('/login')
  async login(@Body() dto: AuthDto, @Req() req: UserPayload): Promise<Jwt> {
    return await this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Регистрация!' })
  @HttpCode(201)
  @Post('/registration')
  async registration(@Body() dto: CreateUserDto): Promise<Jwt> {
    return await this.authService.registration(dto);
  }

  @ApiOperation({ summary: 'Выход!' })
  @HttpCode(200)
  @Post('/logout')
  async logout(@RefreshToken() refreshToken): Promise<void> {
    return await this.authService.logout(refreshToken);
  }

  @ApiOperation({ summary: 'Обновить токен!' })
  @HttpCode(200)
  @Post('/refresh')
  async refresh(@RefreshToken() refreshToken): Promise<Jwt> {
    return await this.authService.refresh(refreshToken);
  }
}
