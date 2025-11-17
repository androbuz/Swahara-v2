// tests/helpers/testApp.js
const express = require('express');
const session = require('express-session');
const multer = require('multer');

/* ---------- 1. MOCK DATABASE ---------- */
jest.mock('../../config/database.js', () => {
  const mockDb = {
    run: jest.fn((sql, params, cb) => cb(null, { lastID: 1 })),
    get: jest.fn((sql, params, cb) => cb(null, { id: 1, name: 'Test User', phone: '+123' })),
    all: jest.fn((sql, params, cb) => cb(null, [])),
  };
  return { __esModule: true, default: mockDb, getInstance: () => mockDb };
});

/* ---------- 2. MOCK RESPONSE METHODS ---------- */
const originalRender = express.response.render;
express.response.render = jest.fn(function (view, data) {
  this.view = view;
  this.context = data || {};
  this.statusCode = 200;
  return this;
});
express.response.redirect = jest.fn(function (url) {
  this.redirectUrl = url;
  this.statusCode = 302;
  return this;
});
express.response.status = jest.fn(function (code) {
  this.statusCode = code;
  return this;
});

/* ---------- 3. BUILD EXPRESS APP ---------- */
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(multer().any());

module.exports = app;