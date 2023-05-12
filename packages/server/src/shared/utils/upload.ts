import { join } from 'path'

// 获取上传服务的路径地址
export function getUploadDir(path): string {
  return join(__dirname, '../../..', path)
}
