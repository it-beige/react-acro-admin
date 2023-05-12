import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { IdDto } from 'src/shared/dtos/id.tdo'

export class createRoleDto {
  @ApiProperty({
    example: 'admin',
  })
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: {
      'dashboard/workplace': ['write', 'read'],
      user: ['read', 'write'],
      course: ['write', 'read'],
      role: ['read', 'write'],
    },
  })
  @IsNotEmpty()
  permissions: object
}
