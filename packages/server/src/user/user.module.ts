import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserController } from './controllers/user.controller'
import { SharedModule } from '../shared/shared.module'
import { UserProviders } from './user.providers'
import { RoleController } from './controllers/role.controller'
import { RoleService } from './services/role.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RedisModule } from '@nestjs-modules/ioredis'

@Module({
  imports: [
    SharedModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.get('jwt'),
    }),
    RedisModule.forRootAsync({
      imports: [SharedModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: configService.get('redis'),
      }),
    }),
  ],
  controllers: [UserController, RoleController, AuthController],
  providers: [
    ...UserProviders,
    UserService,
    RoleService,
    AuthService,
    JwtStrategy,
  ],
  exports: [],
})
export class UserModule {}
