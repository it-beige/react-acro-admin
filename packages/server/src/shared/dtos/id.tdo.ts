import { IsEmpty, Matches } from 'class-validator'
import { regPositive } from '../utils/regexp.util'

export abstract class IdDto {
  /**
   * 主键 id
   */
  @IsEmpty({ message: 'id 不能为空' })
  @Matches(regPositive, { message: '请输入有效 id' })
  readonly id: string
}
