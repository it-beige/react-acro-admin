import { Column, Entity } from 'typeorm'
import { Common } from '../../shared/entities/common.mongo.entity'
import { ObjectId } from 'mongoose'

@Entity()
export class User extends Common {
  // 昵称
  @Column('text')
  name: string

  // @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string

  @Column('text')
  avatar: string

  // 手机号
  @Column('text')
  phoneNumber: string

  @Column()
  password: string

  @Column()
  role?: ObjectId

  @Column()
  job: string

  @Column()
  jobName: string

  @Column()
  organization: string

  @Column()
  organizationName: string

  @Column()
  location: string

  @Column()
  locationName: string

  @Column()
  introduction: string

  @Column()
  personalWebsite: string

  // 加密盐
  @Column({
    type: 'text',
    select: false,
  })
  salt: string
}
