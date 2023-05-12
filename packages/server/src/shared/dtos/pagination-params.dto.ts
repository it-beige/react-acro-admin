import { IsNumber, IsOptional, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class PaginationParams2Dto {
  @ApiPropertyOptional({
    description: 'Optional, defaults to 100',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit = 100

  @ApiPropertyOptional({
    description: 'Optional, defaults to 0',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  offset = 0
}

export class PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'page default to 1',
    type: Number,
    example: 1,
  })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsOptional()
  @Min(0)
  page = 1

  @ApiPropertyOptional({
    description: 'pageSize default to 5',
    type: Number,
    example: 5,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageSize = 5
}
