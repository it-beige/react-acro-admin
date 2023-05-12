import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { MenuService } from '../services/menu.service'
import { ArticleService } from '../services/article.service'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger'

import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@/shared/dtos/base-api-response.dto'
import { CreateMenuDto, UpdateMenuDto } from '../dtos/menu.dto'

import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadDto } from '@/user/dtos/upload.dto'

@ApiTags('菜单')
@Controller('menus')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly articleService: ArticleService,
  ) {}

  @ApiOperation({
    summary: '更新菜单',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(CreateMenuDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() menus: UpdateMenuDto) {
    return {
      data: await this.menuService.update(menus),
    }
  }

  @ApiOperation({
    summary: '查找所有菜单',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([CreateMenuDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async find() {
    const { data } = await this.menuService.find()
    return {
      data,
    }
  }

  @ApiOperation({
    summary: '导入文章',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse({}),
    description: '导入成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
    description: '导入失败',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post('/article/import')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async articleImport(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateTDO: UploadDto,
  ) {
    this.menuService.import(file, updateTDO)
    return {
      ok: 1,
    }
  }

  @ApiOperation({
    summary: '刷新全部内容',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse({}),
    description: '刷新成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
    description: '刷新失败',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh() {
    // const log = await this.spawn('pm2', ['restart', 'cms'], { cwd: './' })
    const log = await this.spawn('ls', ['-l'], { cwd: './' })

    return {
      ok: 1,
      log,
    }
  }

  async spawn(...args) {
    const { spawn } = require('child_process')
    return new Promise((resolve) => {
      const proc = spawn(...args)
      proc.stdout.pipe(process.stdout)
      proc.stderr.pipe(process.stderr)
      let ret = ''
      proc.stdout.on('data', (data) => {
        ret += data.toString()
      })
      proc.on('close', () => {
        resolve(ret)
      })
    })
  }
}
