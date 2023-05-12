import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches } from 'class-validator'

export class BackupDto {
  @ApiProperty({ example: 'init' })
  @IsNotEmpty()
  file?: string
}
