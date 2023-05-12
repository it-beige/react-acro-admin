import { ApiProperty } from '@nestjs/swagger'

export class UploadDto {
  @ApiProperty({
    example: '文件名称',
  })
  name: string

  @ApiProperty({
    required: true,
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File
}
