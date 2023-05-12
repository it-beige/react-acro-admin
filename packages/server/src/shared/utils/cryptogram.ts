import * as crypto from 'crypto'

/**
 * @description: 生成随机盐
 * @param {*} len 长度
 * @return {*}
 */
export function makeSalt(len = 3): string {
  return crypto.randomBytes(len).toString('base64')
}

/**
 * @description: 使用盐加密明文密码
 * @param {*} salt 盐
 * @param {*} password 密码
 * @return {*}
 */
export function generatePassWord(salt: string, password: string) {
  if (!(salt && password)) return ''

  /* 
    password：待加密的密码明文。
    salt：盐值，用于增加加密强度，通常是随机生成的字符串。
    iterations：迭代次数，用于增加加密强度，值越大加密越慢但越安全。
    keylen：生成的密钥长度，以字节为单位。apap
    digest：使用的摘要算法。
  */
  const tempSalt = Buffer.from(salt, 'base64')
  return crypto
    .pbkdf2Sync(password, tempSalt, 1000 * 10, 16, 'sha1')
    .toString('base64')
}

/**
 * @description: 根据文件二进制流进行md5加密
 * @param {Buffer} buffer
 * @return {*}
 */
export function encryptFileMD5(buffer: Buffer): string {
  const md5 = crypto.createHash('md5')
  return md5.update(buffer).digest('hex')
}
