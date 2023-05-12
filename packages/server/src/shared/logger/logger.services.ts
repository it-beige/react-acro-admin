import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createLogger, Logger, format, transports } from 'winston'

@Injectable()
export class AppLogger {
  private context?: string
  private logger: Logger

  public setContext(context: string): void {
    this.context = context
  }

  constructor(
    @Inject('LOGGER_REPOSITORY')
    private readonly loggerRepository,
  ) {
    this.logger = createLogger({
      /* 
        error：只显示错误级别的日志；
        warn：显示错误级别和警告级别的日志；
        info：显示错误级别、警告级别和信息级别的日志；
        verbose：显示错误级别、警告级别、信息级别和详细级别的日志；
        debug：显示所有级别的日志，包括调试级别；
        silly：显示所有级别的日志，包括调试级别和嘈杂级别。
      */
      level: this.loggerRepository.level,
      format: format.combine(format.timestamp(), format.prettyPrint()),
      transports: [
        new transports.File({ filename: 'logs/errros.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.Console(),
      ],
    })
  }

  log(ctx: any, message: string, meta: Record<string, any>): Logger {
    return this.logger.info({
      ctx,
      message: message,
      contextName: this.context,
      ...meta,
    })
  }

  error(ctx: any, message: string, meta: Record<string, any>): Logger {
    return this.logger.error({
      ctx,
      message: message,
      contextName: this.context,
      ...meta,
    })
  }

  warn(ctx: any, message: string, meta: Record<string, any>): Logger {
    return this.logger.warn({
      ctx,
      message: message,
      contextName: this.context,
      ...meta,
    })
  }

  debug(ctx: any, message: string, meta: Record<string, any>): Logger {
    return this.logger.debug({
      ctx,
      message: message,
      contextName: this.context,
      ...meta,
    })
  }

  verbose(ctx: any, message: string, meta: Record<string, any>): Logger {
    return this.logger.verbose({
      ctx,
      message: message,
      contextName: this.context,
      ...meta,
    })
  }
}
