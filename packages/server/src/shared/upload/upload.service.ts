import { Inject, Injectable } from '@nestjs/common'
import type { UPLOAD_TYPE } from '../../user/user.providers'
import { ensureDir, outputFile } from 'fs-extra'
import { encryptFileMD5 } from '../utils/cryptogram'
import { getUploadDir } from '../utils/upload'

@Injectable()
export class UploadService {
  constructor(
    @Inject('UPLOAD_REPOSITORY')
    private readonly uploadRepository: UPLOAD_TYPE,
  ) {}
  async upload(file: Express.Multer.File) {
    const path = this.uploadRepository.path
    const uploadDir = getUploadDir(this.uploadRepository.path)
    await ensureDir(uploadDir)

    const md5Sign = encryptFileMD5(file.buffer)
    const ext = file.originalname.split('.').at(-1)
    const fileName = `${md5Sign}.${ext}`
    const uploadPath = `${uploadDir}/${fileName}`
    await outputFile(uploadPath, file.buffer)

    return {
      url: `/${path}/${fileName}`,
      path: uploadPath,
    }
  }
}
