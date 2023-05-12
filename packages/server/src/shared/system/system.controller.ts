import { BaseApiErrorResponse } from '../dtos/base-api-response.dto'
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { SwaggerBaseApiResponse } from '../dtos/base-api-response.dto'
import { AuthGuard } from '@nestjs/passport'
import { BackupDto } from '../dtos/backup.dto'
import * as moment from 'moment'

@ApiTags('系统维护')
@Controller()
export class SystemController {
  constructor() {}

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

  @ApiOperation({
    summary: '获取数据库备份列表',
  })
  @ApiResponse({
    type: SwaggerBaseApiResponse({}),
    status: HttpStatus.OK,
    description: '获取成功',
  })
  @ApiResponse({
    type: BaseApiErrorResponse,
    status: HttpStatus.NOT_FOUND,
    description: '获取失败',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Get('/database/list')
  async list() {
    const ret = await this.spawn(
      'docker-compose',
      ['exec', '-T', 'mongo', 'ls', '/dump'],
      { cwd: './' },
    )

    const data = ('' + ret).split('\n')
    data.pop()
    return {
      ok: 1,
      data,
    }
  }

  @ApiOperation({
    summary: '获取数据库备份',
  })
  @ApiResponse({
    type: SwaggerBaseApiResponse({}),
    status: HttpStatus.OK,
    description: '备份成功',
  })
  @ApiResponse({
    type: BaseApiErrorResponse,
    status: HttpStatus.NOT_FOUND,
    description: '备份失败',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post('/database/dump')
  async dump() {
    const ret = await this.spawn(
      'docker-compose',
      [
        'exec',
        '-T',
        'mongo',
        'mongodump',
        '--db',
        'nest-server',
        '--out',
        '/dump/' + moment().format('YYYYMMDDhhmmss'),
      ],
      { cwd: './' },
    )
    return {
      ok: 1,
    }
  }

  @ApiOperation({
    summary: '获取数据库恢复',
  })
  @ApiResponse({
    type: SwaggerBaseApiResponse({}),
    status: HttpStatus.OK,
    description: '恢复成功',
  })
  @ApiResponse({
    type: BaseApiErrorResponse,
    status: HttpStatus.NOT_FOUND,
    description: '恢复失败',
  })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post('/database/restroe')
  async restroe(@Body() dto: BackupDto) {
    const ret = await this.spawn(
      'docker-compose',
      [
        'exec',
        '-T',
        'mongo',
        'mongorestore',
        '--db',
        'nest-server',
        `/dump/${dto.file}/nest-server`,
      ],
      { cwd: './' },
    )

    return {
      ok: 1,
    }
  }
}
