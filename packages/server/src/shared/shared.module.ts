import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configModuleOptions } from './configs/module-options';
// import { AllExceptionsFilter } from './filters/all-exceptions.filter';
// import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AppLoggerModule } from './logger/logger.module';

import { UploadService } from './upload/upload.service'

import { DatabaseProviders } from './database/database.providers';
import { CaptchaService } from './captcha/captcha.service';
import { SystemController } from './controllers/system.controller';
import { SystemService } from './services/system.service';
import { SystemProviders } from './system.providers';

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})
export class DatabaseModule { }

@Module({
  controllers: [
    SystemController
  ],

  imports: [
    ConfigModule.forRoot(configModuleOptions),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get<string>('database.host'),
    //     port: configService.get<number | undefined>('database.port'),
    //     database: configService.get<string>('database.name'),
    //     username: configService.get<string>('database.user'),
    //     password: configService.get<string>('database.pass'),
    //     entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
    //     // Timezone configured on the Postgres server.
    //     // This is used to typecast server date/time values to JavaScript Date object and vice versa.
    //     timezone: 'Z',
    //     synchronize: false,
    //     debug: configService.get<string>('env') === 'development',
    //   }),
    // }),
    AppLoggerModule,
  ],
  exports: [
    AppLoggerModule,
    ConfigModule,
    ...DatabaseProviders,
    UploadService,
    CaptchaService,

  ],
  providers: [
    ...DatabaseProviders,
    ...SystemProviders,
    // { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },

    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    CaptchaService,
    UploadService,
    SystemService
  ],
})
export class SharedModule { }
