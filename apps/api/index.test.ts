import request from 'supertest';
import { app } from './index';

describe('', () => {
  it('', async () => {
    await request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(/Express/)
      .expect(200);
  });
});
