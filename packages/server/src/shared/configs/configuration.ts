export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  database: {
    url: process.env.DB_URL,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING,
  },
  logger: {
    level: process.env.LOGGER_LEVEL,
  },
  upload: {
    path: process.env.UPLOAD_PATH,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  cms: {
    validateToken: process.env.NEST_VALIDATE_TOKEN,
    host: process.env.NEXT_HOST,
  },
})
