const db = require('../database');

class Job {
    static async create(jobData) {
        const {
            userId,
            companyName,
            jobTitle,
            jobType,
            location,
            salaryRange,
            description,
            requiredSkills,
            applicationUrl,
            applicationEmail,
            deadline
        } = jobData;

        const sql = `
            INSERT INTO jobs (
                user_id, company_name, job_title, job_type, location,
                salary_range, description, required_skills, application_url,
                application_email, deadline
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const skillsJson = Array.isArray(requiredSkills) ? JSON.stringify(requiredSkills) : requiredSkills;

        try {
            const result = await db.run(sql, [
                userId, companyName, jobTitle, jobType, location,
                salaryRange, description, skillsJson, applicationUrl,
                applicationEmail, deadline
            ]);

            return await this.findById(result.id);
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    }

    static async findById(id) {
        const sql = 'SELECT * FROM jobs WHERE id = ?';
        const job = await db.get(sql, [id]);

        if (job && job.required_skills) {
            try {
                job.required_skills = JSON.parse(job.required_skills);
            } catch (e) {
                job.required_skills = [];
            }
        }

        return job;
    }

    static async findByUserId(userId) {
        const sql = 'SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC';
        const jobs = await db.all(sql, [userId]);

        return jobs.map(j => {
            if (j.required_skills) {
                try {
                    j.required_skills = JSON.parse(j.required_skills);
                } catch (e) {
                    j.required_skills = [];
                }
            }
            return j;
        });
    }

    static async findAll(filters = {}) {
        let sql = 'SELECT j.*, u.full_name as poster_name, u.email as poster_email FROM jobs j LEFT JOIN users u ON j.user_id = u.id WHERE 1=1';
        const params = [];

        if (filters.jobType) {
            sql += ' AND j.job_type = ?';
            params.push(filters.jobType);
        }

        if (filters.status) {
            sql += ' AND j.status = ?';
            params.push(filters.status);
        } else {
            // Default: only show active jobs
            sql += ' AND j.status = ?';
            params.push('active');
        }

        // Only show jobs that haven't passed the deadline
        sql += ' AND (j.deadline IS NULL OR j.deadline >= date("now"))';

        sql += ' ORDER BY j.created_at DESC';

        if (filters.limit) {
            sql += ' LIMIT ?';
            params.push(filters.limit);
        }

        const jobs = await db.all(sql, params);

        return jobs.map(j => {
            if (j.required_skills) {
                try {
                    j.required_skills = JSON.parse(j.required_skills);
                } catch (e) {
                    j.required_skills = [];
                }
            }
            return j;
        });
    }

    static async update(id, userId, updates) {
        const {
            companyName,
            jobTitle,
            jobType,
            location,
            salaryRange,
            description,
            requiredSkills,
            applicationUrl,
            applicationEmail,
            deadline
        } = updates;

        const skillsJson = Array.isArray(requiredSkills) ? JSON.stringify(requiredSkills) : requiredSkills;

        const sql = `
            UPDATE jobs
            SET company_name = ?, job_title = ?, job_type = ?, location = ?,
                salary_range = ?, description = ?, required_skills = ?,
                application_url = ?, application_email = ?, deadline = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        `;

        await db.run(sql, [
            companyName, jobTitle, jobType, location, salaryRange, description,
            skillsJson, applicationUrl, applicationEmail, deadline,
            id, userId
        ]);

        return await this.findById(id);
    }

    static async delete(id, userId) {
        const sql = 'DELETE FROM jobs WHERE id = ? AND user_id = ?';
        const result = await db.run(sql, [id, userId]);
        return result.changes > 0;
    }

    static async setStatus(id, status) {
        const sql = 'UPDATE jobs SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        await db.run(sql, [status, id]);
        return await this.findById(id);
    }
}

module.exports = Job;
