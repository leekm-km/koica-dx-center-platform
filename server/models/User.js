const bcrypt = require('bcrypt');
const db = require('../database');

class User {
    static async create({ email, password, fullName, role = 'student', track = null, batch = null, companyName = null, jobPosition = null, companyWebsite = null }) {
        try {
            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Insert user
            const sql = `
                INSERT INTO users (email, password_hash, full_name, role, track, batch, company_name, job_position, company_website)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await db.run(sql, [email, passwordHash, fullName, role, track, batch, companyName, jobPosition, companyWebsite]);

            // Return created user (without password hash)
            return await this.findById(result.id);
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        return await db.get(sql, [email]);
    }

    static async findById(id) {
        const sql = 'SELECT id, email, full_name, role, track, batch, company_name, job_position, company_website, status, created_at, last_login FROM users WHERE id = ?';
        return await db.get(sql, [id]);
    }

    static async verifyPassword(plainPassword, passwordHash) {
        return await bcrypt.compare(plainPassword, passwordHash);
    }

    static async updateLastLogin(userId) {
        const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
        await db.run(sql, [userId]);
    }

    static async updateProfile(userId, { fullName, track, batch }) {
        const sql = `
            UPDATE users 
            SET full_name = ?, track = ?, batch = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        await db.run(sql, [fullName, track, batch, userId]);
        return await this.findById(userId);
    }

    static async updatePassword(userId, newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const sql = 'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        await db.run(sql, [passwordHash, userId]);
    }

    static async getAll() {
        const sql = 'SELECT id, email, full_name, role, track, batch, company_name, job_position, company_website, status, created_at FROM users';
        return await db.all(sql);
    }
}

module.exports = User;
