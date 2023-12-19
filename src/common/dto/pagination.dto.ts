import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number;
}