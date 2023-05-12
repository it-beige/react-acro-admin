import { Injectable, Inject } from '@nestjs/common'
import { MongoRepository } from 'typeorm'
import { ObjectID } from 'mongodb'
import { Menu } from '../entities/menu.mongo.entity'
import { ArticleService } from './article.service'
import { UploadService } from '@/shared/upload/upload.service'
import { CreateMenuDto, UpdateMenuDto } from '../dtos/menu.dto'
import { plainToClass } from 'class-transformer'
import { UploadDto } from '@/user/dtos/upload.dto'
import { zip } from 'compressing'
import { existsSync, readdir, rm } from 'fs-extra'
import { extname, join } from 'path'
import { readFileSync, readdirSync, rmSync, rmdirSync } from 'fs'

@Injectable()
export class MenuService {
  constructor(
    @Inject('MENU_REPOSITORY')
    private MenuRepository: MongoRepository<Menu>,
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: MongoRepository<Menu>,
    private articleService: ArticleService,
    private uploadService: UploadService,
  ) {}

  async update(menus: UpdateMenuDto) {
    const { upsertedId } = await this.MenuRepository.updateOne(
      {},
      { $set: menus },
      { upsert: true },
    )
    return upsertedId
      ? await this.MenuRepository.findOneBy(upsertedId._id.toHexString())
      : null
  }

  async find(): Promise<{ data: object }> {
    const data = await this.MenuRepository.findOneBy({})
    data && delete data._id
    return {
      data: data ? data : { menus: {} },
    }
  }

  async import(file: Express.Multer.File, updateDto: UploadDto) {
    const { path: uploadPath } = await this.uploadService.upload(file)
    // const [root] = path.split('.')
    const root = uploadPath.replace(extname(uploadPath), '')
    await zip.uncompress(uploadPath, root)
    const ignoreDir = ['.DS_Store', 'images', 'image']

    const categoryList = (await readdir(root))
      .filter((i) => !ignoreDir.includes(i))
      .filter((i) => existsSync(join(root, i)))

    const menus = []
    for (const category of categoryList) {
      // 导入目录(菜单)
      menus.push(await this.importCategory(category, root, ignoreDir))
    }

    await this.update({ menus })
    await rmSync(uploadPath)
    await rm(root, { recursive: true })
  }

  async importCategory(category: string, root: string, ignoreDir: string[]) {
    const categoryDir = (src) => join(root, category, src)
    const articles = readdirSync(join(root, category))
      .filter((i) => existsSync(categoryDir(i)))
      .filter((i) => !ignoreDir.includes(i))
    let children = []
    for (const article of articles) {
      children = children.concat(
        await this.importArticle(article, categoryDir(article), ignoreDir),
      )
    }

    return {
      key: new ObjectID().toString(),
      // 去掉序号
      title: category,
      type: 'category',
      children,
    }
  }

  async importArticle(article: string, articleSrc, ignoreDir: string[]) {
    const articlePaths = readdirSync(articleSrc).filter(
      (i) => !ignoreDir.includes(i),
    )

    const saveArticles = await Promise.all(
      articlePaths.map(async (p) => {
        const src = join(articleSrc, p)
        const ext = extname(src)
        const title = p.replace(ext, '')
        const content = readFileSync(src, 'utf-8')
        const { _id } = await this.articleService.create({ title, content })
        return {
          key: _id,
          title,
          content,
        }
      }),
    )

    return saveArticles
  }
}
