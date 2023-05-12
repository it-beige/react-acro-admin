import { regMobileCN } from '../../shared/utils/regexp.util'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches, isNotEmpty } from 'class-validator'

export class LoginDto {
  /**
   * 手机号（系统唯一）
   */
  @ApiProperty({
    example: '16666666666',
  })
  @IsNotEmpty({ message: '请输入手机号' })
  @Matches(regMobileCN, { message: '请输入正确手机号' })
  phoneNumber: string

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty({ message: '请输入密码' })
  password: string
}
