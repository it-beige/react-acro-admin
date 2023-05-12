import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// 基本的 API 响应类
export class BaseApiResponse<T> {
  public data: T // 数据部分的实际类型是在子类中设置的

  // API 响应中的元数据
  @ApiProperty({ type: Object })
  public meta: any
}

// 用于 Swagger 的基本 API 响应类，接收类型参数
export function SwaggerBaseApiResponse<T>(type: T): typeof BaseApiResponse {
  // 继承自基本的 API 响应类
  class ExtendedBaseApiResponse<T> extends BaseApiResponse<T> {
    // 设置数据部分的实际类型
    @ApiProperty({ type })
    public data: T
  }

  // 这里设置返回的类名，避免 Swagger 将所有响应类型都认为是同一个
  const isAnArray = Array.isArray(type) ? ' [ ] ' : ''
  Object.defineProperty(ExtendedBaseApiResponse, 'name', {
    value: `SwaggerBaseApiResponseFor ${type} ${isAnArray}`,
  })

  return ExtendedBaseApiResponse
}

// 基本的 API 错误对象
export class BaseApiErrorObject {
  @ApiProperty({ type: Number })
  public statusCode: number

  @ApiProperty({ type: String })
  public message: string

  @ApiPropertyOptional({ type: String })
  public localizedMessage: string

  @ApiProperty({ type: String })
  public errorName: string

  @ApiProperty({ type: Object })
  public details: unknown

  @ApiProperty({ type: String })
  public path: string

  @ApiProperty({ type: String })
  public requestId: string

  @ApiProperty({ type: String })
  public timestamp: string
}

// 基本的 API 错误响应类
export class BaseApiErrorResponse {
  @ApiProperty({ type: BaseApiErrorObject })
  public error: BaseApiErrorObject
}
