import { UserService } from './user.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { MongoRepository } from 'typeorm'
import { User } from '../entities/user.mongo.entity'
import { LoginDto } from '../dtos/login.dto'
import { generatePassWord, makeSalt } from '../../shared/utils/cryptogram'
import { AppLogger } from '@/shared/logger/logger.services'
import {
  RegisterCodeDTO,
  RegisterDTO,
  RegisterSMSDTO,
  RegisterSMSPlusDTO,
  UserInfoDto,
  UserInfoVO,
} from '../dtos/auth.dto'
import { Role } from '../entities/role.mongo.entity'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'
import { CaptchaService } from '@/shared/captcha/captcha.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: MongoRepository<Role>,
    private readonly logger: AppLogger,
    @InjectRedis() private readonly redis: Redis,
    private readonly userService: UserService,
    private readonly captchaService: CaptchaService,
  ) {}

  // 使用jwt签发token
  certificate(user: User) {
    const payload = {
      id: user._id,
    }
    const token = this.jwtService.sign(payload)
    return token
  }

  // 登陆校验用户信息
  async checkUserValidity(login: LoginDto) {
    const { phoneNumber, password } = login
    const user = await this.userRepository.findOneBy({ phoneNumber })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    const { salt } = user
    const hashPassWord = generatePassWord(salt, password)
    if (user.password !== hashPassWord) {
      throw new NotFoundException('密码错误')
    }

    return user
  }

  // 登录
  async login(login: LoginDto) {
    const user = await this.checkUserValidity(login)
    const token = await this.certificate(user)
    return {
      data: { token },
    }
  }

  // 查询用户并获取权限
  async info(id: string) {
    const user = await this.userRepository.findOneBy(id)
    const data: UserInfoDto = Object.assign({}, user)
    if (user.role) {
      const role = await this.roleRepository.findOneBy(user.role)
      if (role) data.permissions = role.permissions
    }

    return data
  }

  /**
   * 短信注册
   * @param registerDTO
   * @returns
   */
  async registerBySMS(registerDTO: RegisterSMSDTO): Promise<any> {
    const { phoneNumber, smsCode } = registerDTO
    const codeCache = await this.checkVerifyCode(phoneNumber)
    if (codeCache !== smsCode) {
      throw new NotFoundException('验证码错误或已过期')
    }

    let user = await this.userRepository.findOneBy({ phoneNumber })
    const message = user ? '登录成功' : '注册成功'
    // 用户不存在匿名注册
    if (!user) {
      const password = makeSalt(8)
      user = await this.register({
        phoneNumber,
        name: `手机用户_${phoneNumber}`,
        password,
        passwordRepeat: password,
      })
    }

    const token = await this.certificate(user)
    return {
      code: 200,
      message,
      data: token,
    }
  }

  /**
   * 用户名密码注册
   * @param registerDTO
   * @returns
   */
  async registerBySMSPlus(registerDTO: RegisterSMSPlusDTO): Promise<any> {
    const { phoneNumber, smsCode } = registerDTO
    const codeCache = await this.checkVerifyCode(phoneNumber)
    if (codeCache !== smsCode) {
      throw new NotFoundException('验证码错误或已过期')
    }

    let user = await this.userRepository.findOneBy({ phoneNumber })
    const message = user ? '登录成功' : '注册成功'
    // 用户不存在根据用户提供的信息注册
    if (!user) {
      user = await this.register(registerDTO)
    }

    const token = await this.certificate(user)
    return {
      code: 200,
      message,
      data: token,
    }
  }

  /**
   * 注册
   * @param registerDTO
   * @returns
   */
  async register(registerDTO: RegisterDTO): Promise<any> {
    // 校验用户信息
    await this.checkRegisterForm(registerDTO)

    const { phoneNumber, password, name } = registerDTO
    const { salt, hashPassword } = this.userService.getPassword(password)
    const user = new User()
    user.phoneNumber = phoneNumber
    user.name = name
    user.salt = salt
    user.password = hashPassword

    return await this.userRepository.save(user)
  }

  /**
   * 校验注册信息
   * @param registerDTO
   */
  async checkRegisterForm(registerDTO: RegisterDTO): Promise<any> {
    // 校验重复密码是否一致
    const { password, passwordRepeat, phoneNumber } = registerDTO
    if (password !== passwordRepeat) {
      throw new NotFoundException('两次输入的密码不一致')
    }

    // 校验手机号是否重复注册
    const user = await this.userRepository.findOneBy({ phoneNumber })
    if (user) {
      throw new NotFoundException(`用户已存在,昵称${user.name}`)
    }
  }

  // 生成随机验证码
  generateCode() {
    return Array.from({ length: 4 })
      .map(() => parseInt(Math.random() * 10 + ''))
      .join('')
  }

  async registerCode(register: RegisterCodeDTO) {
    // 验证图形验证码
    const captchaCodeCache = await this.redis.get(
      `captcha_${register.captchaId}`,
    )
    if (!captchaCodeCache) {
      throw new NotFoundException('图形验证码已过期, 请重新生成后验证')
    }
    const { captchaCode, phoneNumber } = register
    if (
      !captchaCode ||
      captchaCodeCache.toLocaleLowerCase() !== captchaCode.toLocaleLowerCase()
    ) {
      throw new NotFoundException('图形验证码错误')
    }

    const code = this.generateCode()
    await this.setVerifyCode(phoneNumber, code)
    return code
  }

  setVerifyCode(phoneNumber, code) {
    return this.redis.set(`${phoneNumber}_code`, code, 'EX', 60)
  }

  checkVerifyCode(phoneNumber) {
    return this.redis.get(`${phoneNumber}_code`)
  }

  /**
   * 获取图形验证码
   */
  async getCaptcha() {
    const { data, text } = await this.captchaService.captche()
    const id = makeSalt(8)
    // 验证码存入将Redis
    this.redis.set(`captcha_${id}`, text, 'EX', 60 * 10)
    const image = `data:image/svg+xml;base64,${Buffer.from(data).toString(
      'base64',
    )}`

    return {
      id,
      image,
    }
  }
}
