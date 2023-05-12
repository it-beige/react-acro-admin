import { Entity, Column } from 'typeorm'
import { Common } from '@/shared/entities/common.mongo.entity'

@Entity()
export class Menu extends Common {
  // 菜单
  @Column('')
  menus: []
}
