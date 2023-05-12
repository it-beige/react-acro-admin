import { SharedModule } from '@/shared/shared.module'
import { Module } from '@nestjs/common'
import { CMSProviders } from './cms.providers'
import { ArticleController } from './controllers/article.controller'
import { MenuController } from './controllers/menu.controller'
import { MenuService } from './services/menu.service'
import { ArticleService } from './services/article.service'

@Module({
  imports: [SharedModule],
  exports: [],
  providers: [...CMSProviders, ArticleService, MenuService],
  controllers: [ArticleController, MenuController],
})
export class CMSModule {}
