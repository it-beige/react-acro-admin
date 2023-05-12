import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as packageConfig from '../package.json'

export const generateDocument = (app) => {
  const { name, version, description } = packageConfig
  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/', app, document)
}
