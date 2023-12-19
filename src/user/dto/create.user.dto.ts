import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'Иван',
    description: 'Имя пользователя',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Имя не должно быть пустым!' })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    type: String,
    example: 'ivan@ivanich.ru',
    description: 'Почта пользователя',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Почта не должна быть пустым!' })
  @Transform(({ value }) => value.trim())
  email: string;

  @ApiProperty({
    type: String,
    example: '123123',
    description: 'Пароль пользователя',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Пароль не должен быть пустым!' })
  @Transform(({ value }) => value.trim())
  password: string;
}
