import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'

const _fields = ['createdAt', 'updatedAt']
@Injectable()
export class RemoveTimestampInterceptor implements NestInterceptor {
  constructor(
    private readonly ignorePaths: string[] = [],
    private readonly fields = _fields,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const { url, method, body } = req

    if (this.ignorePaths.includes(url)) {
      return next.handle()
    }
    if (['PATCH', 'PUT'].includes(method) && body && typeof body === 'object') {
      let { keepTimestamp, ...data } = body
      if (!keepTimestamp) {
        data = this.removeFields(data)
      }
      req.body = data
    }
    return next.handle()
  }

  removeFields(data) {
    if (Array.isArray(data)) {
      data.map((i) => this.removeFields(i))
    }
    this.fields.forEach((k) => {
      Reflect.deleteProperty(data, k)
    })
    return data
  }
}
