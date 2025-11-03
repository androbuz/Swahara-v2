const request = require('supertest');
const app = require('../../app'); 
const User = require('../../models/User');

describe('Auth Controller', () => {
  test('should show login page', async () => {
    const response = await request(app).get('/login');
    expect(response.status).toBe(200);
  });

  test('should login with valid credentials', async () => {
    await User.create('Test User', '+256999888777', 'pass123');

    const response = await request(app)
      .post('/login')
      .send({
        phone: '+256999888777',
        password: 'pass123'
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/dashboard');
  });

  test('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        phone: '+256999888777',
        password: 'wrongpass'
      });

    expect(response.status).toBe(200);
    expect(response.text).toContain('Invalid phone number or password');
  });
});