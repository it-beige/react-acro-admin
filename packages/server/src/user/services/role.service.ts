import { Inject, Injectable } from '@nestjs/common'
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto'
import { createRoleDto } from '../dtos/role.dto'
import { MongoRepository } from 'typeorm'
import { Role } from '../entities/role.mongo.entity'

@Injectable()
export class RoleService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private roleRepository: MongoRepository<Role>,
  ) {}

  create(role: createRoleDto) {
    return this.roleRepository.save(role)
  }

  async findAll({ page, pageSize }: PaginationParamsDto) {
    const [data, count] = await this.roleRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize * 1,
      cache: true,
    })
    return {
      data,
      count,
    }
  }

  async findOne(id: string) {
    return await this.roleRepository.findOneBy(id)
  }

  async update(id: string, role: createRoleDto) {
    ;['_id', 'createdAt', 'updatedAt'].forEach((k) => delete role[k])

    return await this.roleRepository.update(id, role)
  }

  async remove(id: string) {
    return await this.roleRepository.delete(id)
  }
}
