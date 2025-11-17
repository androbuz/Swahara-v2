// jest.setup.js
const express = require('express');

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