import { Module } from '@nestjs/common'
import { SharedService } from './shared.service'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from './configs/module-options'
import { DatabaseProviders } from './database.providers'
import { AppLoggerModule } from './logger/logger.module'
import { CaptchaService } from './captcha/captcha.service'
import { UploadService } from '@/shared/upload/upload.service'

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule {}

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), AppLoggerModule],
  exports: [
    ConfigModule,
    ...DatabaseProviders,
    AppLoggerModule,
    CaptchaService,
    SharedService,
    UploadService,
  ],
  providers: [
    ...DatabaseProviders,
    CaptchaService,
    SharedService,
    UploadService,
  ],
})
export class SharedModule {}
