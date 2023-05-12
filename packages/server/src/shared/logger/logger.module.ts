import { Module } from '@nestjs/common'
import { AppLogger } from './logger.services'
import { AppLoggerProvides } from './logger.provides'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from '../configs/module-options'

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
  exports: [AppLogger],
  providers: [AppLogger, ...AppLoggerProvides],
})
export class AppLoggerModule {}
