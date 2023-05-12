import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common'
import { UserService } from '../services/user.service'
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'

import { UploadDto } from '../dtos/upload.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'

@Controller('user')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '新增用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CreateUserDto),
    description: '创建成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
    description: '创建失败',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post('')
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user)
  }

  @ApiOperation({
    summary: '查找所有用户',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CreateUserDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query() query: PaginationParamsDto) {
    return this.userService.findAll(query)
  }

  @ApiOperation({
    summary: '查找单个用户',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CreateUserDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.userService.findOne(id),
    }
  }

  @ApiOperation({
    summary: '更新用户',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(UpdateUserDto),
    description: '更新成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
    description: '更新失败',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return {
      data: await this.userService.update(id, user),
    }
  }

  @ApiOperation({
    summary: '删除用户',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: SwaggerBaseApiResponse([CreateUserDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }

  @ApiOperation({
    summary: '文件上传',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse({}),
    description: '上传成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
    description: '上传失败',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Req() req: any,
    @Body() upload: UploadDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.userService.uploadAvatar(file)
  }
}
