import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { IsDueDate } from '../validators/due.date.validator';

export class CreateTaskDto {
  @ApiProperty({
    type: String,
    example: 'Уроки',
    description: 'Имя задачи',
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    type: String,
    example: 'Сделать уроки',
    description: 'Описание задачи',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Date,
    example: new Date().toISOString(),
    description: 'Срок выполнения задачи',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @IsDueDate()
  @IsOptional()
  deadline?: Date;

  @ApiProperty({
    type: Date,
    example: 1,
    description: 'ID создателя задачи',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  userId?: number;
}
