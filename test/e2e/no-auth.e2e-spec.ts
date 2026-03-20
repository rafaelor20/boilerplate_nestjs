import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MailService } from '../../src/modules/mail/mail.service';

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
    })
      .overrideProvider(MailService)
      .useValue({
        contactUs: jest.fn(),
        forgotPassword: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
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

  describe('/no-auth/verify-code (POST)', () => {
    it('should return a 400 error if the code is not provided', () => {
      return request(app.getHttpServer()).post('/no-auth/verify-code').send({}).expect(400);
    });
  });

  describe('/no-auth/reset (POST)', () => {
    it('should return a 400 error if the code is not provided', () => {
      return request(app.getHttpServer())
        .post('/no-auth/reset')
        .send({
          password: 'new-password',
        })
        .expect(400);
    });
  });

  describe('/no-auth/contact-us (POST)', () => {
    it('should return a 400 error if the request body is invalid', () => {
      return request(app.getHttpServer()).post('/no-auth/contact-us').send({}).expect(400);
    });
  });

  describe('/no-auth/texts (GET)', () => {
    it('should return a 400 error if the query parameter is invalid', () => {
      return request(app.getHttpServer())
        .get('/no-auth/texts')
        .query({ type: 'invalid-type' })
        .expect(400);
    });

    it('should return a 200 status with the texts if the query parameter is valid', () => {
      return request(app.getHttpServer())
        .get('/no-auth/texts')
        .query({ type: 'About' })
        .expect(200);
    });
  });

  describe('/no-auth/users (GET)', () => {
    it('should return a 200 status with an array of users', () => {
      return request(app.getHttpServer())
        .get('/no-auth/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/no-auth/health-check (GET)', () => {
    it('should return a 200 OK status and a success message', () => {
      return request(app.getHttpServer())
        .get('/no-auth/health-check')
        .expect(200)
        .expect({ message: 'Servidor UP' });
    });
  });

  describe('/my-self (GET)', () => {
    it('should return a 401 error if the user is not authenticated', () => {
      return request(app.getHttpServer()).get('/my-self').expect(401);
    });
  });
});
