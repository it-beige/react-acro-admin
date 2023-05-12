import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Observable, map } from 'rxjs'
import { isObject } from '../utils/util'

export const RemoveSensitiveUrls = ['/info']

// export class RemoveSensitiveInterceptor implements NestInterceptor {
//   constructor(private readonly urls) {}
//   intercept(context: ExecutionContext, next: CallHandler) {
//     const req = context.switchToHttp().getRequest()
//     const url = req.url
//     return next.handle().pipe(
//       map((res) => {
//         // if (!this.urls.includes(url)) return res
//         return this.removeSensitiveData(res)
//       }),
//     )
//   }

//   removeSensitiveData(data: any): any {
//     if (data === undefined || data === null) {
//       return data
//     }

//     if (Array.isArray(data)) {
//       return data.map((item) => this.removeSensitiveData(item))
//     }

//     if (typeof data !== 'object') return data

//     Object.keys(data).forEach((k) => {
//       if (['password', 'salt'].includes(k)) {
//         Reflect.deleteProperty(data, k)
//       } else {
//         data[k] = this.removeSensitiveData(data[k])
//       }
//     })

//     return data
//   }
// }

export class RemoveSensitiveInterceptor implements NestInterceptor {
  constructor(readonly ignoredFields: string[] = ['password', 'salt']) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()

    return next.handle().pipe(
      map((res) => {
        if (res && typeof res === 'object') {
          const ignoredKeys = new Set(this.ignoredFields)
          const ignore = (key: string) => ignoredKeys.has(key)

          if (Array.isArray(res)) {
            return res.map((item) => this.removeFields(item, ignore))
          } else {
            return this.removeFields(res, ignore)
          }
        }

        return res
      }),
    )
  }

  removeFields(data: any, ignore: (key: string) => boolean) {
    const result: any = {}

    for (const [key, value] of Object.entries(data)) {
      if (ignore(key)) {
        continue
      }

      if (value && isObject(value)) {
        result[key] = this.removeFields(value, ignore)
      } else {
        result[key] = value
      }
    }

    return result
  }
}
