import { UploadService } from '../../shared/upload/upload.service'
import { Inject, Injectable } from '@nestjs/common'
import { SharedService } from '../../shared/shared.service'
import { ConfigService } from '@nestjs/config'
import { MongoRepository } from 'typeorm'
import { User } from '../entities/user.mongo.entity'
import { AppLogger } from '../../shared/logger/logger.services'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'
import { generatePassWord, makeSalt } from '@/shared/utils/cryptogram'
import { Role } from '../entities/role.mongo.entity'
import { UpdateUserDto } from '../dtos/user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly SharedService: SharedService,
    private readonly ConfigService: ConfigService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: MongoRepository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: MongoRepository<Role>,
    private readonly logger: AppLogger,
    private readonly uploadService: UploadService,
  ) {
    this.logger.setContext(new.target.name)
  }

  public getPassword(password) {
    const salt = makeSalt() // 制作密码盐
    const hashPassword = generatePassWord(salt, password) // 加密密码
    return { salt, hashPassword }
  }

  /* 
    create: 创建并返回一个新的 User 实例。
    save: 将一个新的或者已存在的 User 实例保存到数据库中。
    delete: 从数据库中删除指定的 User 实例。
    findOne: 根据指定的查询条件返回一个满足条件的 User 实例。
    find: 根据指定的查询条件返回多个满足条件的 User 实例。
    update: 更新数据库中一个已存在的 User 实例的属性值。
  */
  create(user) {
    if (user.password) {
      const { salt, hashPassword } = this.getPassword(user.password)
      user.salt = salt
      user.password = hashPassword
    }
    return this.userRepository.save(user)
  }

  async getRole(user) {
    const roles = await this.roleRepository.findBy({})
    return roles.find((role) => '' + user.role === '' + role._id)
  }

  async findAll({
    page,
    pageSize,
  }: PaginationParamsDto): Promise<{ data: User[]; count: number }> {
    // https://typeorm.io/#/find-options
    // findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>
    /* 
      FindManyOptions 包含了多个属性，以下是常用的属性：
      where: 指定查询条件，例如 { name: 'john' } 表示查询 name 为 john 的记录。
      order: 指定排序方式，例如 { name: 'ASC' } 表示按照 name 字段升序排序。
      skip: 指定查询的起始位置（用于分页），例如 10 表示从第 11 条记录开始查询。
      take: 指定查询的记录数量（用于分页），例如 20 表示查询 20 条记录。
      relations: 指定关联查询的实体（使用 TypeORM 中的实体关系）。
      select: 指定查询的字段（属性）列表，例如 [ 'name', 'age' ] 表示只查询 name 和 age 字段。

    */
    const [data, count] = await this.userRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    })

    for (const user of data) {
      const role = await this.getRole(user)
      if (role) {
        user['roleData'] = role
      }
    }
    return {
      data,
      count,
    }
  }

  async findOne(id: string) {
    const entity = await this.userRepository.findOneBy(id)
    if (entity.role) {
      entity['roleData'] = await this.getRole(entity)
    }
    return { ...entity, _id: entity._id.toHexString() }
  }

  async update(id: string, user: UpdateUserDto) {
    // 去除时间戳和id
    ;['_id', 'createdAt', 'updatedAt'].forEach((k) =>
      Reflect.deleteProperty(user, k),
    )
    // 如果更新密码
    if (user.password) {
      const { salt, hashPassword } = this.getPassword(user.password)

      user.salt = salt
      user.password = hashPassword
    }

    return await this.userRepository.update(id, user)
  }

  async remove(id: string) {
    return await this.userRepository.delete(id)
  }

  /**
   * 上传头像
   */
  async uploadAvatar(file) {
    const { url } = await this.uploadService.upload(file)
    return { data: url }
  }
}
