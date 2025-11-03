const database = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  constructor(id, name, phone, avatar, initials, password) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.avatar = avatar;
    this.initials = initials;
    this.password = password;
  }

  static async findById(id) {
    const row = await database.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!row) return null;
    return new User(row.id, row.name, row.phone, row.avatar, row.initials, row.password);
  }

  static async findByPhone(phone) {
    const row = await database.get('SELECT * FROM users WHERE phone = ?', [phone]);
    if (!row) return null;
    return new User(row.id, row.name, row.phone, row.avatar, row.initials, row.password);
  }

  static async validatePassword(phone, password) {
    const row = await database.get('SELECT * FROM users WHERE phone = ?', [phone]);
    if (!row) return false;
    return row.password === password;
  }

  static async getCurrentUser(user_id = null) {
    const row = await database.get('SELECT * FROM users WHERE id = ?', [user_id]);
    if (!row) return null;
    return new User(row.id, row.name, row.phone, row.avatar, row.initials, row.password);
  }

  // Single create method that handles all fields
  static async create(name, phone, password, avatar = null, initials = null) {
    // Generate initials if not provided
    if (!initials) {
      const nameParts = name.split(' ');
      initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2);
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await database.run(
      'INSERT INTO users (name, phone, password, avatar, initials) VALUES (?, ?, ?, ?, ?)',
      [name, phone, hashedPassword, avatar, initials]
    );

    return new User(result.id, name, phone, avatar, initials, hashedPassword);
  }

  async validatePassword(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  }

  static async create(name, phone, password, avatar = null, initials = null) {
    // Generate initials if not provided
    if (!initials) {
      const nameParts = name.split(' ');
      initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await database.run(
      'INSERT INTO users (name, phone, password, avatar, initials) VALUES (?, ?, ?, ?, ?)',
      [name, phone, hashedPassword, avatar, initials]
    );

    return new User(result.lastID, name, phone, avatar, initials, hashedPassword);
  }

  static async getAllUsers() {
    const rows = await database.all('SELECT * FROM users ORDER BY name');
    return rows.map(row => 
      new User(row.id, row.name, row.phone, row.avatar, row.initials, row.password)
    );
  }
}

module.exports = User;