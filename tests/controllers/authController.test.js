// tests/controllers/authController.test.js
const request = require('supertest');
const express = require('express');
const AuthController = require('../../controllers/authController');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/login', AuthController.showLogin);
app.get('/signup', AuthController.showSignup);

describe('AuthController – simple render tests', () => {
  test('showLogin renders login template', async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).toBe(200);
    expect(res.view).toBe('login');
  });

  test('showSignup renders signup template', async () => {
    const res = await request(app).get('/signup');
    expect(res.statusCode).toBe(200);
    expect(res.view).toBe('signup');
  });
});