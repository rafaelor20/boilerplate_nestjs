import { jest, describe, it, beforeAll, afterAll } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../../src/app.module';
import { UploadService } from '../../src/modules/upload/upload.service';
import { Readable } from 'stream';
import * as fs from 'fs';

jest.mock('@nestjs/common', () => {
  const original = jest.requireActual('@nestjs/common') as object;

  return {
    ...original,
    ParseFilePipeBuilder: jest.fn().mockImplementation(() => ({
      addFileTypeValidator: () => ({
        addMaxSizeValidator: () => ({
          build: () => ({
            transform: (value: any) => value, // 👈 não valida nada
          }),
        }),
      }),
    })),
  };
});

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        send: jest.fn().mockImplementation(async () => {
          return {
            Body: Readable.from('test data'),
            ContentType: 'application/octet-stream',
          };
        }),
      };
    }),
    GetObjectCommand: jest.fn(),
  };
});

describe('UploadController (e2e)', () => {
  let app: INestApplication;

  const mockUploadService = {
    uploadOneFile: jest.fn<(...args: any[]) => any>(),
    uploadManyFiles: jest.fn<(...args: any[]) => any>(),
    getFileById: jest.fn<(...args: any[]) => any>(),
    deleteProfilePhoto: jest.fn<(...args: any[]) => any>(),
    deleteFileById: jest.fn<(...args: any[]) => any>(),
  };

  beforeAll(async () => {
    fs.writeFileSync('test.png', 'test');
    fs.writeFileSync('test1.png', 'test');
    fs.writeFileSync('test2.jpg', 'test');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UploadService)
      .useValue(mockUploadService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    fs.unlinkSync('test.png');
    fs.unlinkSync('test1.png');
    fs.unlinkSync('test2.jpg');
    if (app) {
      await app.close();
    }
  });

  describe('/upload/one-file (POST)', () => {
    it('should upload a single file', () => {
      const response = { fileUrl: 'some-url', fileKey: 'some-key' };
      mockUploadService.uploadOneFile.mockResolvedValue(response);

      return request(app.getHttpServer())
        .post('/upload/one-file')
        .attach('file', 'test.png')
        .expect(201)
        .expect(response);
    });
  });

  describe('/upload/many-files (POST)', () => {
    it('should upload multiple files', () => {
      const response = [
        { fileUrl: 'url1', fileKey: 'key1' },
        { fileUrl: 'url2', fileKey: 'key2' },
      ];
      mockUploadService.uploadManyFiles.mockResolvedValue(response);

      return request(app.getHttpServer())
        .post('/upload/many-files')
        .attach('files', 'test1.png')
        .attach('files', 'test2.jpg')
        .expect(201)
        .expect(response);
    });
  });

  describe('/one-file/:id (GET)', () => {
    it('should get a file by id', () => {
      const file = {
        id: 1,
        fileKey: 'some-key',
        fileUrl: 'some-url',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        folder: null,
        ownerId: null,
      };
      mockUploadService.getFileById.mockResolvedValue(file);

      return request(app.getHttpServer()).get('/one-file/1').expect(200).expect(file);
    });

    it('should return 400 for invalid id', () => {
      return request(app.getHttpServer()).get('/one-file/abc').expect(400);
    });
  });

  describe('/one-file/download/:id (GET)', () => {
    it('should download a file by id', () => {
      // We need to return a value that can be destructured to get `fileKey`
      mockUploadService.getFileById.mockResolvedValue({
        id: 1,
        fileKey: 'some-key',
        fileUrl: 'some-url',
        createdAt: new Date(),
        updatedAt: new Date(),
        folder: null,
        ownerId: null,
      });

      return request(app.getHttpServer()).get('/one-file/download/1').expect(200);
    });
  });

  describe('/profile-photo (DELETE)', () => {
    it('should delete a profile photo', () => {
      const response = { id: 1, name: 'test' };
      mockUploadService.deleteProfilePhoto.mockResolvedValue(response);

      return request(app.getHttpServer())
        .delete('/profile-photo?fileKey=some-key')
        .expect(200)
        .expect(response);
    });
  });

  describe('/one-file/:id (DELETE)', () => {
    it('should delete a file by id', () => {
      const response = { message: 'File deleted successfully' };
      mockUploadService.deleteFileById.mockResolvedValue(response);

      return request(app.getHttpServer()).delete('/one-file/1').expect(200).expect(response);
    });
  });
});
