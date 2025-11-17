// tests/controllers/agreementController.test.js
const request = require('supertest');
const express = require('express');
const AgreementController = require('../../controllers/agreementController');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/dashboard', AgreementController.showDashboard);
app.get('/create-agreement', AgreementController.showCreateForm);

describe('AgreementController – simple render tests', () => {
  test('showDashboard renders dashboard', async () => {
    const res = await request(app).get('/dashboard');
    expect(res.statusCode).toBe(200);
    expect(res.view).toBe('dashboard');
  });

  test('showCreateForm renders create‑agreement', async () => {
    const res = await request(app).get('/create-agreement');
    expect(res.statusCode).toBe(200);
    expect(res.view).toBe('create-agreement');
  });
});