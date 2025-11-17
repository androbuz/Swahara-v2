// tests/controllers/userController.test.js
const request = require('supertest');
const express = require('express');
const UserController = require('../../controllers/userController');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/profile', UserController.showProfile);

describe('UserController – simple render test', () => {
  test('showProfile renders profile (no session needed)', async () => {
    const res = await request(app).get('/profile');
    // Your real controller probably redirects or shows a login page.
    // For the minimal suite we just verify it returns 200.
    expect(res.statusCode).toBe(200);
  });
});