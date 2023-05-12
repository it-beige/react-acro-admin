import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { generateDocument } from './doc'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { getUploadDir } from './shared/utils/upload'
import { RemoveSensitiveInterceptor } from './shared/interceptors/remove-sensitive.interceptor'
import { RemoveTimestampInterceptor } from './shared/interceptors/remove-timestamp-interceptor'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

async function bootstrap() {
  // 修改运行平台
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 安全防御
  app.use(helmet({}))

  // 请求频次控制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  )

  // app.use(helmet({
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: [`'self'`],
  //       styleSrc: [`'self'`, `'unsafe-inline'`, 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
  //       fontSrc: [`'self'`, 'fonts.gstatic.com'],
  //       imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
  //       scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`],
  //     },
  //   }
  // }))

  // 静态服务
  const uploadDir = getUploadDir(process.env.UPLOAD_PATH)
  app.useStaticAssets(uploadDir, {
    prefix: '/static/upload',
  })

  // 允许不能识别的值
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  )

  // 添加全局管道
  app.useGlobalPipes(new ValidationPipe())

  // 使用全局拦截器处理敏感数据
  app.useGlobalInterceptors(
    new RemoveSensitiveInterceptor(),
    new RemoveTimestampInterceptor(),
  )

  // 生成swagger文档
  generateDocument(app)
  await app.listen(3000)
}
bootstrap()
