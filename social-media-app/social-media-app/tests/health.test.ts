import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { createApp } from '../src/app.bootstrap.js';

describe('GET /health', () => {
  it('responds with a 200 and an ok status', async () => {
    const { app } = createApp();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

describe('unmatched routes', () => {
  it('returns a 404 for unknown routes', async () => {
    const { app } = createApp();

    const response = await request(app).get('/this-route-does-not-exist');

    expect(response.status).toBe(404);
  });
});
