import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { MailService } from '../../src/modules/mail/mail.service';
import { PrismaService } from '../../src/database/PrismaService';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import request = require('supertest');

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return { send: jest.fn() };
    }),
  };
});

describe('AdminSettingsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let noPermissionToken: string;
  let adminUser: User;

  beforeAll(async () => {
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
    prisma = app.get<PrismaService>(PrismaService);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    // Cleanup before tests to prevent constraint errors if previous run failed
    await prisma.user.deleteMany({});
    await prisma.adminPermission.deleteMany({});

    // Create permissions
    await prisma.adminPermission.create({
      data: { name: 'Settings' },
    });

    // Create an admin user for testing
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashSync('password', 10),
        role: 'Admin',
        status: 'Active',
        document: '111.111.111-11',
        adminPermissions: {
          connect: { name: 'Settings' },
        },
      },
    });

    // Create a user without permissions
    await prisma.user.create({
      data: {
        name: 'No Permission User',
        email: 'no-permission@example.com',
        password: hashSync('password', 10),
        role: 'Admin',
        status: 'Active',
        document: '222.222.222-22',
      },
    });

    // Login as admin to get token
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'admin@example.com', password: 'password' });

    adminToken = adminLoginResponse.body.token;

    // Login as no permission user to get token
    const noPermissionLoginResponse = await request(app.getHttpServer())
      .post('/login')
      .send({ email: 'no-permission@example.com', password: 'password' });

    noPermissionToken = noPermissionLoginResponse.body.token;
  });

  afterAll(async () => {
    // Cleanup the database
    await prisma.user.deleteMany({});
    await prisma.adminPermission.deleteMany({});
    if (app) {
      await app.close();
    }
  });

  describe('/admin-settings/all-permissions (GET)', () => {
    it('should return all permissions', () => {
      return request(app.getHttpServer())
        .get('/admin-settings/all-permissions')
        .expect((res) => {
          if (res.status === 400) console.log('200 error: ', res.body);
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/admin-settings (POST)', () => {
    it('should return a 401 error if the user is not authenticated', () => {
      return request(app.getHttpServer()).post('/admin-settings').send({}).expect(401);
    });

    it("should return a 403 error if the user does not have the 'Settings' permission", () => {
      return request(app.getHttpServer())
        .post('/admin-settings')
        .set('Authorization', `Bearer ${noPermissionToken}`)
        .send({
          name: 'New Admin',
          email: 'newadmin@example.com',
          document: '333.333.333-33',
          password: 'password',
          adminPermissions: ['Settings'],
        })
        .expect((res) => {
          if (res.status === 400) console.log('403 error: ', res.body);
        })
        .expect(403);
    });

    it('should return a 201 status and the created admin if the payload is valid', () => {
      return request(app.getHttpServer())
        .post('/admin-settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Admin',
          email: 'newadmin@example.com',
          document: '333.333.333-33',
          password: 'password',
          adminPermissions: ['Settings'],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.admin).toHaveProperty('id');
          expect(res.body.admin.name).toBe('New Admin');
        });
    });
  });

  describe('/admin-settings (GET)', () => {
    it('should return a 401 error if the user is not authenticated', () => {
      return request(app.getHttpServer()).get('/admin-settings').expect(401);
    });

    it("should return a 403 error if the user does not have the 'Settings' permission", () => {
      return request(app.getHttpServer())
        .get('/admin-settings')
        .set('Authorization', `Bearer ${noPermissionToken}`)
        .expect((res) => {
          if (res.status === 400) console.log('403 error: ', res.body);
        })
        .expect(403);
    });

    it('should return a 200 status and an array of admins', () => {
      return request(app.getHttpServer())
        .get('/admin-settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect((res) => {
          if (res.status === 400) console.log('200 error: ', res.body);
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.admins)).toBe(true);
        });
    });
  });

  describe('/admin-settings/:id (GET)', () => {
    it('should return a 401 error if the user is not authenticated', () => {
      return request(app.getHttpServer()).get(`/admin-settings/${adminUser.id}`).expect(401);
    });

    it("should return a 403 error if the user does not have the 'Settings' permission", () => {
      return request(app.getHttpServer())
        .get(`/admin-settings/${adminUser.id}`)
        .set('Authorization', `Bearer ${noPermissionToken}`)
        .expect((res) => {
          if (res.status === 400) console.log('403 error: ', res.body);
        })
        .expect(403);
    });

    it('should return a 404 error if the admin does not exist', () => {
      return request(app.getHttpServer())
        .get('/admin-settings/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect((res) => {
          if (res.status === 400) console.log('404 error: ', res.body);
        })
        .expect(404);
    });

    it('should return a 200 status and the admin if the id is valid', () => {
      return request(app.getHttpServer())
        .get(`/admin-settings/${adminUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect((res) => {
          if (res.status === 400) console.log('200 error: ', res.body);
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', adminUser.id);
        });
    });
  });

  describe('/admin-settings/:id (PATCH)', () => {
    it('should return a 401 error if the user is not authenticated', () => {
      return request(app.getHttpServer())
        .patch(`/admin-settings/${adminUser.id}`)
        .send({})
        .expect(401);
    });

    it("should return a 403 error if the user does not have the 'Settings' permission", () => {
      return request(app.getHttpServer())
        .patch(`/admin-settings/${adminUser.id}`)
        .set('Authorization', `Bearer ${noPermissionToken}`)
        .send({
          name: 'New Admin',
        })
        .expect(403);
    });

    it('should return a 404 error if the admin does not exist', () => {
      return request(app.getHttpServer())
        .patch('/admin-settings/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'test Admin',
        })
        .expect(404);
    });

    it('should return a 200 status and the updated admin if the payload is valid', () => {
      return request(app.getHttpServer())
        .patch(`/admin-settings/${adminUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Name',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', adminUser.id);
          expect(res.body.name).toBe('Updated Name');
        });
    });
  });
});
