const User = require('../../models/User');
const bcrypt = require('bcrypt');

describe('User Model', () => {
  const testUser = {
    name: 'Test User',
    phone: '+256777888999',
    password: 'testpass123'
  };

  test('should create a new user', async () => {
    const user = await User.create(
      testUser.name,
      testUser.phone,
      testUser.password
    );

    expect(user).toBeDefined();
    expect(user.name).toBe(testUser.name);
    expect(user.phone).toBe(testUser.phone);
    expect(user.initials).toBe('TU');
    expect(await bcrypt.compare(testUser.password, user.password)).toBe(true);
  });

  test('should find user by phone', async () => {
    await User.create(testUser.name, testUser.phone, testUser.password);
    const found = await User.findByPhone(testUser.phone);
    
    expect(found).toBeDefined();
    expect(found.phone).toBe(testUser.phone);
  });

  test('should validate correct password', async () => {
    const user = await User.create(
      testUser.name,
      testUser.phone,
      testUser.password
    );
    
    const isValid = await user.validatePassword(testUser.password);
    expect(isValid).toBe(true);
  });

  test('should reject invalid password', async () => {
    const user = await User.create(
      testUser.name,
      testUser.phone,
      testUser.password
    );
    
    const isValid = await user.validatePassword('wrongpass');
    expect(isValid).toBe(false);
  });
});