const Agreement = require('../../models/Agreement');
const User = require('../../models/User');

describe('Agreement Model', () => {
  let testUser;
  let testParty;

  beforeEach(async () => {
    testUser = await User.create('Creator User', '+256111222333', 'pass123');
    testParty = await User.create('Other Party', '+256444555666', 'pass123');
  });

  test('should create a new agreement', async () => {
    const agreement = await Agreement.create({
      title: 'Test Agreement',
      description: 'Test Description',
      otherPartyName: testParty.name,
      otherPartyPhone: testParty.phone,
      createdById: testUser.id,
      amount: '1000',
      dueDate: '2024-01-01'
    });

    expect(agreement).toBeDefined();
    expect(agreement.title).toBe('Test Agreement');
    expect(agreement.status).toBe('pending');
  });

  test('should get pending agreements for user', async () => {
    await Agreement.create({
      title: 'Test Agreement',
      description: 'Test Description',
      otherPartyName: testParty.name,
      otherPartyPhone: testParty.phone,
      createdById: testUser.id
    });

    const pending = await Agreement.getPendingAgreements(testParty.phone);
    expect(pending).toHaveLength(1);
    expect(pending[0].status).toBe('pending');
  });

  test('should accept agreement', async () => {
    const agreement = await Agreement.create({
      title: 'Test Agreement',
      description: 'Test Description',
      otherPartyName: testParty.name,
      otherPartyPhone: testParty.phone,
      createdById: testUser.id
    });

    await Agreement.accept(agreement.id);
    const updated = await Agreement.findById(agreement.id);
    expect(updated.status).toBe('active');
  });

  test('should get stats', async () => {
    await Agreement.create({
      title: 'Active Agreement',
      description: 'Test Description',
      otherPartyName: testParty.name,
      otherPartyPhone: testParty.phone,
      createdById: testUser.id,
      status: 'active'
    });

    const stats = await Agreement.getStats(testUser.id, testUser.phone);
    expect(stats).toBeDefined();
    expect(stats.totalActive).toBe(1);
  });
});