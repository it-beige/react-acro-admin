import { ConfigService } from '@nestjs/config'

export const AppLoggerProvides = [
  {
    provide: 'LOGGER_REPOSITORY',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
        level: configService.get('logger.level'),
      }
    },
  },
]
