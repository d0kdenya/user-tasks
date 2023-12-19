import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class AuthDto {
  @ApiProperty({
    type: String,
    example: 'example@mail.ru',
    description: 'Почта пользователя',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '123123',
    description: 'Пароль пользователя',
    required: true,
  })
  @IsString()
  password: string;
}
