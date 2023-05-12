import { Injectable } from '@nestjs/common'
import { create } from 'svg-captcha'
import type { ConfigObject } from 'svg-captcha'

@Injectable()
export class CaptchaService {
  async captche(options?: ConfigObject) {
    if (!options) {
      options = {}
    }

    options = {
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
      ...options,
    }
    return create(options)
  }
}
