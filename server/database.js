const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');

class Database {
    constructor() {
        this.db = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) {
                    console.error('Database connection error:', err);
                    reject(err);
                } else {
                    console.log('✅ Connected to SQLite database');
                    this.initializeTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async initializeTables() {
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                track INTEGER,
                batch TEXT,
                company_name TEXT,
                job_position TEXT,
                company_website TEXT,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login DATETIME
            )
        `;

        const createSessionsTable = `
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token_hash TEXT NOT NULL,
                expires_at DATETIME NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `;

        const createPortfoliosTable = `
            CREATE TABLE IF NOT EXISTS portfolios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                track INTEGER,
                batch TEXT,
                major TEXT,
                skills TEXT,
                project_title TEXT NOT NULL,
                project_description TEXT,
                github_url TEXT,
                demo_url TEXT,
                image_url TEXT,
                status TEXT DEFAULT 'approved',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        const createJobsTable = `
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                company_name TEXT NOT NULL,
                job_title TEXT NOT NULL,
                job_type TEXT NOT NULL,
                location TEXT,
                salary_range TEXT,
                description TEXT NOT NULL,
                required_skills TEXT,
                application_url TEXT,
                application_email TEXT,
                deadline DATE,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(createUsersTable, (err) => {
                    if (err) {
                        console.error('Error creating users table:', err);
                        reject(err);
                    } else {
                        console.log('✅ Users table ready');
                    }
                });

                this.db.run(createSessionsTable, (err) => {
                    if (err) {
                        console.error('Error creating sessions table:', err);
                        reject(err);
                    } else {
                        console.log('✅ Sessions table ready');
                    }
                });

                this.db.run(createPortfoliosTable, (err) => {
                    if (err) {
                        console.error('Error creating portfolios table:', err);
                        reject(err);
                    } else {
                        console.log('✅ Portfolios table ready');
                    }
                });

                this.db.run(createJobsTable, (err) => {
                    if (err) {
                        console.error('Error creating jobs table:', err);
                        reject(err);
                    } else {
                        console.log('✅ Jobs table ready');
                        resolve();
                    }
                });
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
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
                    console.log('✅ Database connection closed');
                    resolve();
                }
            });
        });
    }
}

module.exports = new Database();
