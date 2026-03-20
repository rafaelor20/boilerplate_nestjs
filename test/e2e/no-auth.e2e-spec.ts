import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return { send: jest.fn() }; // mocks the send method used for AWS commands
    }),
  };
});

describe('NoAuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Bootstrap the entire application with its dependencies (including Prisma)
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/no-auth/health-check (GET)', () => {
    it('should return a 200 OK status and a success message', () => {
      return request(app.getHttpServer())
        .get('/no-auth/health-check')
        .expect(200)
        .expect({ message: 'Servidor UP' });
    });
  });

  describe('/no-auth/forgot (POST)', () => {
    it('should return 404 if the email does not exist in the database', () => {
      return request(app.getHttpServer())
        .post('/no-auth/forgot')
        .send({ email: 'non.existent@example.com' })
        .expect(404)
        .expect((res) => expect(res.body.message).toBe('Not Found'));
    });
  });
});
