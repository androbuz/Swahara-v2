const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'swahara.db');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error connecting to database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.initializeTables()
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  }

  initializeTables() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Users table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            avatar TEXT,
            initials TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating users table:', err);
            reject(err);
            return;
          }
        });

        // Agreements table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS agreements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            other_party_name TEXT NOT NULL,
            other_party_phone TEXT NOT NULL,
            created_by_id INTEGER NOT NULL,
            created_date DATE DEFAULT (date('now')),
            status TEXT DEFAULT 'active',
            amount TEXT,
            due_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by_id) REFERENCES users(id)
          )
        `, (err) => {
          if (err) {
            console.error('Error creating agreements table:', err);
            reject(err);
            return;
          }
        });

        // Seed initial data
        this.seedData()
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  seedData() {
    return new Promise((resolve, reject) => {
      // Check if current user exists
      this.db.get('SELECT id FROM users WHERE phone = ?', ['+256 772 345678'], (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          // Insert current user
          this.db.run(`
            INSERT INTO users (name, phone, password, avatar, initials) 
            VALUES (?, ?, ?, ?, ?)
          `, [
            'Mukasa James',
            '+256 772 345678',
            'passpass',
            'https://images.unsplash.com/photo-1622626426572-c268eb006092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
            'MJ'
          ], function(err) {
            if (err) {
              reject(err);
              return;
            }

            const currentUserId = this.lastID;

            // Insert sample agreements
            const agreements = [
              {
                title: 'Boda Boda Purchase',
                description: 'Agreement to purchase a Bajaj Boxer motorcycle in excellent condition. Payment to be made in three installments through Mobile Money.',
                other_party_name: 'Nakato Grace',
                other_party_phone: '+256 704 123456',
                amount: 'UGX 3,500,000',
                due_date: '2025-11-15',
                status: 'active',
                created_date: '2025-10-15'
              },
              {
                title: 'Shop Rental Agreement',
                description: 'Renting shop space in Nakawa Market for 6 months. Includes security and monthly cleaning of common areas.',
                other_party_name: 'Okello Patrick',
                other_party_phone: '+256 782 987654',
                amount: 'UGX 500,000',
                due_date: '2026-01-10',
                status: 'active',
                created_date: '2025-10-10'
              },
              {
                title: 'Website Design Services',
                description: 'Create a complete website for retail business including mobile design, payment integration, and 3 months support.',
                other_party_name: 'Nambi Catherine',
                other_party_phone: '+256 701 456789',
                amount: 'UGX 2,000,000',
                due_date: '2025-11-30',
                status: 'active',
                created_date: '2025-10-20'
              },
              {
                title: 'Matooke Supply Agreement',
                description: 'Weekly supply of fresh matooke from Masaka. Delivery every Monday morning to Kabalagala. Minimum 5 bunches per delivery.',
                other_party_name: 'Wasswa David',
                other_party_phone: '+256 777 234567',
                amount: 'UGX 150,000',
                status: 'pending',
                created_date: '2025-10-22'
              },
              {
                title: 'Event Photography',
                description: 'Professional photography for wedding introduction ceremony. Includes full day coverage, 200 edited photos, and photo album.',
                other_party_name: 'Auma Rose',
                other_party_phone: '+256 703 876543',
                amount: 'UGX 800,000',
                status: 'cancelled',
                created_date: '2025-10-24'
              },
              {
                title: 'Posho Mill Equipment Sale',
                description: 'Selling posho mill grinding machine. 2 years old, good working condition. Includes maintenance manual.',
                other_party_name: 'Nakato Grace',
                other_party_phone: '+256 704 123456',
                amount: 'UGX 1,200,000',
                status: 'pending',
                created_date: '2025-10-25'
              }
            ];

            const stmt = database.db.prepare(`
              INSERT INTO agreements (title, description, other_party_name, other_party_phone, created_by_id, amount, due_date, status, created_date)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            agreements.forEach(agr => {
              stmt.run(
                agr.title,
                agr.description,
                agr.other_party_name,
                agr.other_party_phone,
                currentUserId,
                agr.amount,
                agr.due_date || null,
                agr.status,
                agr.created_date
              );
            });

            stmt.finalize(() => {
              console.log('Database seeded successfully');
              resolve();
            });
          });
        } else {
          resolve();
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

const database = new Database();

module.exports = database;
