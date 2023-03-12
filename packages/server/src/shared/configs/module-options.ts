// import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

import configuration from './configuration';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
  // validationSchema: Joi.object({
  //   APP_ENV: Joi.string()
  //     .valid('development', 'production', 'test')
  //     .default('development'),
  //   APP_PORT: Joi.number().required(),
  //   DB_URL: Joi.string().required(),
  //   DB_NAME: Joi.string().required(),
  //   DB_USER: Joi.string().required(),
  //   DB_PASS: Joi.string().required(),
  //   JWT_PUBLIC_KEY_BASE64: Joi.string().required(),
  //   JWT_PRIVATE_KEY_BASE64: Joi.string().required(),
  //   JWT_ACCESS_TOKEN_EXP_IN_SEC: Joi.number().required(),
  //   JWT_REFRESH_TOKEN_EXP_IN_SEC: Joi.number().required(),
  //   DEFAULT_ADMIN_USER_PASSWORD: Joi.string().required(),
  // }),
};
