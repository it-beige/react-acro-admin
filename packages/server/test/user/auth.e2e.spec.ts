import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'

describe('AuthController(e2e)', () => {
  describe('/auth/login(POST)', () => {
    let app: INestApplication

    beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

      app = moduleFixture.createNestApplication()
      await app.init()
    })

    it('should return token when username and password are corret', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ phoneNumber: '18888888888', password: '888888' })
      expect(response.body.data.token).toBeDefined()
    })

    it('should return 401 when username and password are corret', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ phoneNumber: '18888888888', password: '88881188' })

      expect(response.body.statusCode === 404)
    })

    afterEach(async () => {
      await app.close()
    })
  })
})
