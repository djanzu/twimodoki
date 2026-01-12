const db = require('./src/database');

async function migrate() {
    console.log('Starting migration...');
    try {
        await db.run(`
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                images TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Migration completed: Table "posts" is ready.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        db.close();
    }
}

migrate();
