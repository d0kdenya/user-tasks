import { PaginationDto } from "../../common/dto/pagination.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class GetTasksParamsDto extends PaginationDto {
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