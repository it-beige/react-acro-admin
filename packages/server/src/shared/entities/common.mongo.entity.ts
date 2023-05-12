import { IdDto } from 'src/shared/dtos/id.tdo'
import {
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
  VersionColumn,
  ObjectID,
} from 'typeorm'

@Entity()
export class Common {
  @ObjectIdColumn()
  _id: ObjectID

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  /* 
    @Column() 装饰器用于指定实体类中对应的列的属性，它支持多种配置，以下是一些常用的配置：
      type: 指定列的数据类型，例如 varchar、integer、boolean、text 等。
      length: 指定列的长度。例如，如果 type 是 varchar，则可以使用此选项指定字符串的最大长度。
      nullable: 声明此列是否可以为空。
      default: 设置默认值。
      unique: 设置此列是否唯一。
      precision: 设置数字类型的精度。
      scale: 设置数字类型的比例。
      select: 声明此列是否可选择。
      insert: 声明此列是否可插入。
      update: 声明此列是否可更新
  */
  @Column({
    default: false,
    select: false,
  })
  isDelete: boolean

  @VersionColumn({
    select: false,
  })
  version: number
}
