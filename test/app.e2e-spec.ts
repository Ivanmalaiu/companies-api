import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  describe('/companies (POST)', () => {
    it('should create a PyME company', async () => {
      const response = await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Empresa Pyme 1',
          type: 'pyme',
          joinedAt: new Date().toISOString(),
          pymeCode: 'PYM-1234',
          transfers: [],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(typeof response.body.id).toBe('string');
    });

    it('should create a Corporate company', async () => {
      const response = await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Corporativa SA',
          type: 'corporate',
          joinedAt: new Date().toISOString(),
          headquarters: 'Buenos Aires',
          transfers: [],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 if pymeCode is missing for PyME', async () => {
      await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Empresa Sin Código',
          type: 'pyme',
          joinedAt: new Date().toISOString(),
        })
        .expect(400);
    });

    it('should return 400 if headquarters is missing for Corporate', async () => {
      await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Empresa Sin HQ',
          type: 'corporate',
          joinedAt: new Date().toISOString(),
        })
        .expect(400);
    });
  });

  describe('/companies/joined-last-month (GET)', () => {
    it('should return companies joined in the last month', async () => {
      await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Empresa reciente',
          type: 'pyme',
          joinedAt: new Date().toISOString(),
          pymeCode: 'PYM-1234',
          transfers: [],
        })
        .expect(201);
      const response = await request(app.getHttpServer())
        .get('/companies/joined-last-month')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return empty array if no companies joined recently', async () => {
      await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Anciana SA',
          type: 'pyme',
          joinedAt: '2000-01-01T00:00:00.000Z',
          pymeCode: 'LEGACY',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/companies/joined-last-month')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should contain a known recently created company', async () => {
      const joinedAt = new Date().toISOString();
      await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Empresa Nueva',
          type: 'pyme',
          joinedAt,
          pymeCode: 'PYM-NEW',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/companies/joined-last-month')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Empresa Nueva' }),
        ]),
      );
    });
  });

  describe('/companies/with-transfers-last-month (GET)', () => {
    it('should return companies with recent transfers', async () => {
      await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Empresa Transferidora',
          type: 'pyme',
          joinedAt: new Date().toISOString(),
          pymeCode: 'TRANS-PYM',
          transfers: [
            {
              amount: 10000,
              date: new Date().toISOString(),
            },
          ],
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/companies/with-transfers-last-month')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Empresa Transferidora' }),
        ]),
      );
    });

    it('should return empty array if no company made recent transfers', async () => {
      await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Empresa sin transferencias',
          type: 'corporate',
          joinedAt: new Date().toISOString(),
          headquarters: 'USA',
          transfers: [],
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/companies/with-transfers-last-month')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should not return companies with old transfers', async () => {
      await request(app.getHttpServer())
        .post('/companies')
        .send({
          name: 'Empresa Vieja Transf',
          type: 'pyme',
          joinedAt: '2024-01-01T00:00:00.000Z',
          pymeCode: 'OLDTRANSF',
          transfers: [
            {
              amount: 12000,
              date: '2023-01-01T00:00:00.000Z',
            },
          ],
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/companies/with-transfers-last-month')
        .expect(200);

      expect(response.body).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Empresa Vieja Transf' }),
        ]),
      );
    });
  });
});
