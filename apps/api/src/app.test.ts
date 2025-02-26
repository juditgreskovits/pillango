import request from 'supertest';
import { app } from './app';

describe('Api', () => {
  describe('/', () => {
    it('returns some text', async () => {
      await request(app)
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(/Express/)
        .expect(200);
    });
  });

  describe('/health', () => {
    it('returns 200', async () => {
      await request(app).get('/health').expect(200);
    });
  });
});
