const database = require('../config/database');

class Agreement {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.otherPartyName = data.other_party_name;
    this.otherPartyPhone = data.other_party_phone;
    this.createdById = data.created_by_id;
    this.createdDate = data.created_date;
    this.status = data.status;
    this.amount = data.amount;
    this.dueDate = data.due_date;
  }

  static async getMyActiveAgreements(currentUserId) {
    const rows = await database.all(
      'SELECT * FROM agreements WHERE created_by_id = ? AND status = ? ORDER BY created_date DESC',
      [currentUserId, 'active']
    );
    return rows.map(row => new Agreement(row));
  }

  static async getPendingAgreements(currentUserPhone) {
    const rows = await database.all(
      'SELECT * FROM agreements WHERE status = ? AND other_party_phone = ? ORDER BY created_date DESC',
      ['pending', currentUserPhone]
    );
    return rows.map(row => new Agreement(row));
  }

  static async getAgreementsByParty(partyName, currentUserId) {
    const rows = await database.all(
      'SELECT * FROM agreements WHERE created_by_id = ? AND other_party_name = ? ORDER BY created_date DESC',
      [currentUserId, partyName]
    );
    return rows.map(row => new Agreement(row));
  }

  static async findById(id) {
    const row = await database.get('SELECT * FROM agreements WHERE id = ?', [id]);
    if (!row) return null;
    return new Agreement(row);
  }

  static async create(data) {
    // removing the phone code symbol '+ 
    data.otherPartyPhone = data.otherPartyPhone.replace('+', '');
    // trim whitespace
    data.otherPartyPhone = data.otherPartyPhone.trim();
    
    const result = await database.run(
      `INSERT INTO agreements 
       (title, description, other_party_name, other_party_phone, created_by_id, amount, due_date, status, created_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, date('now'))`,
      [
        data.title,
        data.description,
        data.otherPartyName,
        data.otherPartyPhone,
        data.createdById,
        data.amount || null,
        data.dueDate || null,
        data.status || 'active'
      ]
    );

    return await Agreement.findById(result.id);
  }

  static async accept(agreementId) {
    await database.run(
      'UPDATE agreements SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['active', agreementId]
    );
    return await Agreement.findById(agreementId);
  }

  static async reject(agreementId) {
    await database.run(
      'UPDATE agreements SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['cancelled', agreementId]
    );
    return await Agreement.findById(agreementId);
  }

  static async getStats(currentUserId, currentUserPhone) {
    // Get total earned (sum of active agreements)
    const earnedRow = await database.get(
      `SELECT SUM(CAST(REPLACE(REPLACE(amount, 'UGX ', ''), ',', '') AS INTEGER)) as total
       FROM agreements 
       WHERE created_by_id = ? AND status = 'active' AND amount IS NOT NULL AND amount LIKE 'UGX%'`,
      [currentUserId]
    );

    // Get agreement counts by status
    const statusRows = await database.all(
      `SELECT status, COUNT(*) as count 
       FROM agreements 
       WHERE created_by_id = ? OR other_party_phone = ?
       GROUP BY status`,
      [currentUserId, currentUserPhone]
    );

    const statusCounts = {
      active: 0,
      pending: 0,
      cancelled: 0
    };

    statusRows.forEach(row => {
      statusCounts[row.status] = row.count;
    });

    // Get monthly earnings (last 6 months)
    const monthlyRows = await database.all(
      `SELECT 
         strftime('%Y-%m', due_date) as month,
         SUM(CAST(REPLACE(REPLACE(amount, 'UGX ', ''), ',', '') AS INTEGER)) as total
       FROM agreements 
       WHERE created_by_id = ? 
         AND status = 'active' 
         AND amount IS NOT NULL 
         AND amount LIKE 'UGX%'
         AND due_date >= date('now', '-6 months')
       GROUP BY month
       ORDER BY month`,
      [currentUserId]
    );

    return {
      totalEarned: earnedRow.total || 0,
      statusCounts,
      monthlyEarnings: monthlyRows
    };
  }
}

module.exports = Agreement;
