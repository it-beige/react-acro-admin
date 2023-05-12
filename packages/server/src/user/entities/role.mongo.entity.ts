import { Column, Entity } from 'typeorm'
import { Common } from '../../shared/entities/common.mongo.entity'

@Entity()
export class Role extends Common {
  @Column({
    type: 'text',
  })
  name: string

  @Column('')
  permissions: object
}
