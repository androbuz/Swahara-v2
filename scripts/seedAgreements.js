const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./data/swahara.db');

(async () => {
  console.log('🌱 Seeding database...');

  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    db.serialize(() => {
      // Insert demo user
      db.run(`
        INSERT INTO users (name, phone, password, avatar, initials)
        VALUES (?, ?, ?, ?, ?)
      `, [
        'Demo User',
        '+256700000001',
        hashedPassword,
        'https://randomuser.me/api/portraits/men/10.jpg',
        'DU'
      ], function (err) {
        if (err) {
          console.error('❌ Error creating demo user:', err.message);
          return;
        }

        const userId = this.lastID;
        console.log(`✅ Demo user created with ID: ${userId}`);

        const stmt = db.prepare(`
          INSERT INTO agreements (
            title, description, other_party_name, other_party_phone,
            created_by_id, amount, due_date, status, created_date
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (let i = 1; i <= 100; i++) {
          stmt.run(
            `Agreement #${i}`,
            `This is a sample agreement record number ${i}.`,
            `Party ${i}`,
            `+2567${String(1000000 + i).slice(-7)}`,
            userId,
            `UGX ${1000 + i * 50}`,
            `2025-12-${(i % 28) + 1}`,
            i % 3 === 0 ? 'active' : i % 3 === 1 ? 'pending' : 'cancelled',
            '2025-11-01'
          );
        }

        stmt.finalize(() => {
          console.log('✅ Inserted 100 dummy agreements');
          console.log('\n🎉 Done!\n');
          console.log('Log in using:');
          console.log('Phone: +256700000001');
          console.log('Password: password123');
        });
      });
    });
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
