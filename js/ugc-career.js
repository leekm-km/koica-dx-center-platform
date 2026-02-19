// UGC Career/Job Management with Database Integration
class CareerUGC {
    constructor() {
        this.modal = document.getElementById('job-modal');
        this.form = document.getElementById('job-form');
        this.container = document.getElementById('job-container');
        this.postBtn = document.querySelector('[data-action="post-job"]');

        this.attachEventListeners();
        this.loadJobs();
    }

    attachEventListeners() {
        if (this.postBtn) {
            this.postBtn.addEventListener('click', () => {
                // Check if user is logged in
                if (!authManager.isAuthenticated()) {
                    showToast('Please login to post a job', 'error');
                    setTimeout(() => {
                        window.location.href = 'lms.html';
                    }, 1500);
                    return;
                }
                this.showModal();
            });
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('modal-close')) {
                    this.hideModal();
                }
            });
        }

        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    showModal() {
        if (this.modal) {
            this.modal.classList.add('modal-active');
        }
    }

    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('modal-active');
            if (this.form) this.form.reset();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);

        const jobData = {
            companyName: formData.get('company-name'),
            jobTitle: formData.get('job-title'),
            jobType: formData.get('job-type'),
            location: formData.get('location'),
            salaryRange: formData.get('salary-range'),
            description: formData.get('description'),
            requiredSkills: formData.get('skills').split(',').map(s => s.trim()).filter(s => s),
            applicationUrl: formData.get('application-url'),
            applicationEmail: formData.get('application-email'),
            deadline: formData.get('deadline')
        };

        try {
            const response = await JobAPI.create(jobData);

            showToast('Job posted successfully!', 'success');
            this.hideModal();

            // Reload jobs
            await this.loadJobs();
        } catch (error) {
            console.error('Error posting job:', error);
            showToast(error.message || 'Failed to post job', 'error');
        }
    }

    async loadJobs() {
        try {
            const response = await JobAPI.getAll();
            const jobs = response.jobs || [];

            if (!this.container) return;

            // Clear existing jobs (except template or static ones)
            const userGeneratedCards = this.container.querySelectorAll('.job-card[data-db-job]');
            userGeneratedCards.forEach(card => card.remove());

            // Add new jobs to the beginning
            jobs.forEach(job => {
                this.addJobCard(job);
            });
        } catch (error) {
            console.error('Error loading jobs:', error);
        }
    }

    addJobCard(job) {
        if (!this.container) return;

        const card = document.createElement('div');
        card.className = 'job-card';
        card.setAttribute('data-db-job', job.id);

        const skillBadges = (job.required_skills || []).map(skill =>
            `<span class="tag">${skill}</span>`
        ).join('');

        const applicationLink = job.application_url ?
            `<a href="${job.application_url}" class="btn btn-primary btn-sm" target="_blank" rel="noopener">Apply Now</a>` :
            `<a href="mailto:${job.application_email}" class="btn btn-primary btn-sm">Apply via Email</a>`;

        const deadlineText = job.deadline ?
            `<span class="job-meta-item">📅 Deadline: ${new Date(job.deadline).toLocaleDateString()}</span>` : '';

        // Check permissions for delete button
        const currentUser = authManager.getCurrentUser();
        const isOwner = currentUser && job.user_id === currentUser.id;
        const isAdmin = authManager.isAdmin();

        let actionButtons = '';
        if (isOwner) {
            actionButtons = `<button class="btn btn-sm btn-danger" onclick="careerUGC.deleteJob(${job.id})" style="margin-left: 10px;">Delete</button>`;
        } else if (isAdmin) {
            actionButtons = `<button class="btn btn-sm btn-danger" onclick="careerUGC.deleteJob(${job.id})" style="margin-left: 10px; background: #dc2626;">🛡️ Admin Delete</button>`;
        }

        card.innerHTML = `
            <div class="job-header">
                <div>
                    <h3>${job.job_title}</h3>
                    <p class="job-company">${job.company_name}</p>
                </div>
                <div class="badge badge-primary">${job.job_type}</div>
            </div>
            <div class="job-meta">
                ${job.location ? `<span class="job-meta-item">📍 ${job.location}</span>` : ''}
                ${job.salary_range ? `<span class="job-meta-item">💰 ${job.salary_range}</span>` : ''}
                ${deadlineText}
            </div>
            <p class="job-description">${job.description}</p>
            ${skillBadges ? `<div class="job-skills">${skillBadges}</div>` : ''}
            <div class="job-footer">
                ${applicationLink}
                ${actionButtons}
            </div>
        `;

        // Insert at the beginning
        this.container.insertBefore(card, this.container.firstChild);
    }

    async deleteJob(jobId) {
        if (!confirm('Are you sure you want to delete this job posting?')) {
            return;
        }

        try {
            await JobAPI.delete(jobId);
            showToast('Job deleted successfully', 'success');
            await this.loadJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            showToast(error.message || 'Failed to delete job', 'error');
        }
    }
}

// Initialize when DOM is ready
let careerUGC;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        careerUGC = new CareerUGC();
        window.careerUGC = careerUGC;
    });
} else {
    careerUGC = new CareerUGC();
    window.careerUGC = careerUGC;
}
