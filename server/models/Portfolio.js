const db = require('../database');

class Portfolio {
    static async create(portfolioData) {
        const {
            userId,
            name,
            track,
            batch,
            major,
            skills,
            projectTitle,
            projectDescription,
            githubUrl,
            demoUrl,
            imageUrl
        } = portfolioData;

        const sql = `
            INSERT INTO portfolios (
                user_id, name, track, batch, major, skills,
                project_title, project_description, github_url, demo_url, image_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : skills;

        try {
            const result = await db.run(sql, [
                userId, name, track, batch, major, skillsJson,
                projectTitle, projectDescription, githubUrl, demoUrl, imageUrl
            ]);

            return await this.findById(result.id);
        } catch (error) {
            console.error('Error creating portfolio:', error);
            throw error;
        }
    }

    static async findById(id) {
        const sql = 'SELECT * FROM portfolios WHERE id = ?';
        const portfolio = await db.get(sql, [id]);

        if (portfolio && portfolio.skills) {
            try {
                portfolio.skills = JSON.parse(portfolio.skills);
            } catch (e) {
                portfolio.skills = [];
            }
        }

        return portfolio;
    }

    static async findByUserId(userId) {
        const sql = 'SELECT * FROM portfolios WHERE user_id = ? ORDER BY created_at DESC';
        const portfolios = await db.all(sql, [userId]);

        return portfolios.map(p => {
            if (p.skills) {
                try {
                    p.skills = JSON.parse(p.skills);
                } catch (e) {
                    p.skills = [];
                }
            }
            return p;
        });
    }

    static async findAll(filters = {}) {
        let sql = 'SELECT p.*, u.full_name as author_name, u.email as author_email FROM portfolios p LEFT JOIN users u ON p.user_id = u.id WHERE 1=1';
        const params = [];

        if (filters.track) {
            sql += ' AND p.track = ?';
            params.push(filters.track);
        }

        if (filters.status) {
            sql += ' AND p.status = ?';
            params.push(filters.status);
        } else {
            // Default: only show approved portfolios
            sql += ' AND p.status = ?';
            params.push('approved');
        }

        sql += ' ORDER BY p.created_at DESC';

        if (filters.limit) {
            sql += ' LIMIT ?';
            params.push(filters.limit);
        }

        const portfolios = await db.all(sql, params);

        return portfolios.map(p => {
            if (p.skills) {
                try {
                    p.skills = JSON.parse(p.skills);
                } catch (e) {
                    p.skills = [];
                }
            }
            return p;
        });
    }

    static async update(id, userId, updates) {
        const {
            name,
            track,
            batch,
            major,
            skills,
            projectTitle,
            projectDescription,
            githubUrl,
            demoUrl,
            imageUrl
        } = updates;

        const skillsJson = Array.isArray(skills) ? JSON.stringify(skills) : skills;

        const sql = `
            UPDATE portfolios
            SET name = ?, track = ?, batch = ?, major = ?, skills = ?,
                project_title = ?, project_description = ?, github_url = ?,
                demo_url = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        `;

        await db.run(sql, [
            name, track, batch, major, skillsJson,
            projectTitle, projectDescription, githubUrl, demoUrl, imageUrl,
            id, userId
        ]);

        return await this.findById(id);
    }

    static async delete(id, userId) {
        const sql = 'DELETE FROM portfolios WHERE id = ? AND user_id = ?';
        const result = await db.run(sql, [id, userId]);
        return result.changes > 0;
    }

    static async setStatus(id, status) {
        const sql = 'UPDATE portfolios SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        await db.run(sql, [status, id]);
        return await this.findById(id);
    }
}

module.exports = Portfolio;
