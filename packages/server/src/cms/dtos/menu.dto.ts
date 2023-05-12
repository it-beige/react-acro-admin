import {
  ApiExtraModels,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateMenuDto {
  @ApiProperty({
    example: [
      {
        key: 'xxx',
        title: '一级标题',
        type: 'category',
        children: [
          {
            key: 'xxx',
            title: '文章一',
            type: 'article',
          },
        ],
      },
    ],
  })
  @IsNotEmpty()
  menus: any[]

  // @ApiProperty({
  //   example: 'xxx',
  // })
  // @IsNotEmpty({ message: 'key不能为空' })
  // key: string

  // @ApiProperty({
  //   example: '一级标题',
  // })
  // @IsNotEmpty({ message: '标题不能为空' })
  // title: string

  // @ApiProperty({
  //   example: 'category',
  // })
  // @IsNotEmpty({ message: '类型不能为空' })
  // type: string

  // @ApiProperty({
  //   example: [
  //     {
  //       key: 'xxx',
  //       title: '文章一',
  //       type: 'article',
  //     },
  //   ],
  //   type: [CreateMenuDto],
  // })
  // children?: CreateMenuDto[]
}

@ApiExtraModels(CreateMenuDto)
export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
