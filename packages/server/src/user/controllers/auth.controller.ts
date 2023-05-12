import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { LoginDto } from '../dtos/login.dto'
import { AuthService } from '../services/auth.service'
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto'
import { AuthGuard } from '@nestjs/passport'
import {
  RegisterCodeDTO,
  RegisterSMSDTO,
  RegisterSMSPlusDTO,
  UserInfoDto,
  UserInfoSuccessVO,
} from '../dtos/auth.dto'

@ApiTags('认证鉴权')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '用户登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([LoginDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Post('login')
  async login(@Body() login: LoginDto) {
    return await this.authService.login(login)
  }

  @ApiOperation({
    summary: '获取用户信息',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserInfoDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @ApiBearerAuth()
  @Get('info')
  @UseGuards(AuthGuard('jwt'))
  async info(@Req() req: any): Promise<any> {
    const data = await this.authService.info(req.user.id)
    return {
      data,
    }
  }

  @ApiOperation({
    summary: '短信验证码',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserInfoDto]),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Post('registerCode')
  async registerCode(@Body() registerCode: RegisterCodeDTO) {
    const code = await this.authService.registerCode(registerCode)
    return {
      msg: '验证码已发送',
      data: { code },
    }
  }

  @ApiOperation({
    summary: '获取图形验证码',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Get('captcha')
  async getCaptcha() {
    const data = await this.authService.getCaptcha()
    return {
      data,
    }
  }

  @ApiOperation({
    summary: '短信用户注册/登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(RegisterSMSDTO),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Post('registerBySMS')
  async registerBySMS(
    @Body() registerDTO: RegisterSMSDTO,
  ): Promise<UserInfoSuccessVO> {
    return this.authService.registerBySMS(registerDTO)
  }

  @ApiOperation({
    summary: '用户密码/验证码/注册',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(RegisterSMSDTO),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @Post('registerByPassword')
  async registerBySMSPlus(
    @Body() registerDTO: RegisterSMSPlusDTO,
  ): Promise<any> {
    return this.authService.registerBySMSPlus(registerDTO)
  }
}
