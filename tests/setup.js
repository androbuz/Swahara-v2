const database = require('../config/database');

beforeAll(async () => {
  await database.connect();
});

afterAll(async () => {
  await database.close();
});

beforeEach(async () => {
  // Clear test database tables
  await database.run('DELETE FROM agreements');
  await database.run('DELETE FROM users');
});