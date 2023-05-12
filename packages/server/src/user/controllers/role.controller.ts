import { BaseApiErrorResponse } from '../../shared/dtos/base-api-response.dto'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@/shared/dtos/base-api-response.dto'
import { createRoleDto } from '../dtos/role.dto'
import { RoleService } from '../services/role.service'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'

@Controller('role')
@ApiTags('角色管理')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: '新增角色',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(createRoleDto),
    description: '创建成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Post('')
  create(@Body() role: createRoleDto) {
    return this.roleService.create(role)
  }

  @ApiOperation({
    summary: '查找所有角色',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([createRoleDto]),
    description: '查找成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
    description: '查找失败',
  })
  @Get()
  async findAll(@Query() query: PaginationParamsDto) {
    const { data, count } = await this.roleService.findAll(query)
    return {
      data,
      meta: {
        total: count,
      },
    }
  }

  @ApiOperation({
    summary: '查找单个角色',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(createRoleDto),
    description: '查找成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
    description: '查找失败',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.roleService.findOne(id),
    }
  }

  @ApiOperation({
    summary: '更新角色',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(createRoleDto),
    description: '更新成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
    description: '更新失败',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: createRoleDto,
  ) {
    return {
      data: await this.roleService.update(id, updateCourseDto),
    }
  }

  @ApiOperation({
    summary: '删除角色',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(createRoleDto),
    description: '删除成功',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    type: BaseApiErrorResponse,
    description: '删除失败',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.roleService.remove(id)
  }
}
