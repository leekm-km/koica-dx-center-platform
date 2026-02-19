// UGC Portfolio Management with Database Integration
class TalentPoolUGC {
    constructor() {
        this.modal = document.getElementById('portfolio-modal');
        this.form = document.getElementById('portfolio-form');
        this.container = document.getElementById('trainee-container');
        this.addBtn = document.querySelector('[data-action="add-portfolio"]');

        this.attachEventListeners();
        this.loadPortfolios();
    }

    attachEventListeners() {
        if (this.addBtn) {
            this.addBtn.addEventListener('click', () => {
                // Check if user is logged in
                if (!authManager.isAuthenticated()) {
                    showToast('Please login to add your portfolio', 'error');
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

        const portfolioData = {
            name: formData.get('name'),
            track: formData.get('track') ? parseInt(formData.get('track')) : null,
            batch: formData.get('batch'),
            major: formData.get('major'),
            skills: formData.get('skills').split(',').map(s => s.trim()).filter(s => s),
            projectTitle: formData.get('project-title'),
            projectDescription: formData.get('project-description'),
            githubUrl: formData.get('github-url'),
            demoUrl: formData.get('demo-url'),
            imageUrl: formData.get('image-url')
        };

        try {
            const response = await PortfolioAPI.create(portfolioData);

            showToast('Portfolio added successfully!', 'success');
            this.hideModal();

            // Reload portfolios
            await this.loadPortfolios();
        } catch (error) {
            console.error('Error adding portfolio:', error);
            showToast(error.message || 'Failed to add portfolio', 'error');
        }
    }

    async loadPortfolios() {
        try {
            const response = await PortfolioAPI.getAll();
            const portfolios = response.portfolios || [];

            if (!this.container) return;

            // Clear existing portfolios (except template or static ones)
            const userGeneratedCards = this.container.querySelectorAll('.portfolio-card[data-db-portfolio]');
            userGeneratedCards.forEach(card => card.remove());

            // Add new portfolios to the beginning
            portfolios.forEach(portfolio => {
                this.addPortfolioCard(portfolio);
            });
        } catch (error) {
            console.error('Error loading portfolios:', error);
        }
    }

    addPortfolioCard(portfolio) {
        if (!this.container) return;

        const card = document.createElement('div');
        card.className = 'trainee-card';
        card.setAttribute('data-db-portfolio', portfolio.id);
        card.setAttribute('data-track', portfolio.track || '');

        const trackText = portfolio.track ? `Track ${portfolio.track}` : '';
        const batchText = portfolio.batch ? `Batch ${portfolio.batch}` : '';
        const trackBatch = [trackText, batchText].filter(Boolean).join(' • ');

        const skillBadges = (portfolio.skills || []).map(skill =>
            `<span class="tag">${skill}</span>`
        ).join('');

        const isNew = (new Date() - new Date(portfolio.created_at)) < 24 * 60 * 60 * 1000;

        // Check permissions for delete button
        const currentUser = authManager.getCurrentUser();
        const isOwner = currentUser && portfolio.user_id === currentUser.id;
        const isAdmin = authManager.isAdmin();

        let actionButtons = '';
        if (isOwner) {
            actionButtons = `
                <button class="btn btn-sm btn-danger" onclick="talentPoolUGC.deletePortfolio(${portfolio.id})" style="margin-top: 10px;">
                    Delete Portfolio
                </button>
            `;
        } else if (isAdmin) {
            actionButtons = `
                <button class="btn btn-sm btn-danger" onclick="talentPoolUGC.deletePortfolio(${portfolio.id})" style="margin-top: 10px; background: #dc2626;">
                    🛡️ Admin Delete
                </button>
            `;
        }

        card.innerHTML = `
            <div class="trainee-avatar">
                ${portfolio.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <h3>${portfolio.name}</h3>
            <p class="trainee-info">${trackBatch}</p>
            <p class="trainee-major">${portfolio.major || ''}</p>
            <div class="trainee-skills">
                ${skillBadges}
            </div>
            <div class="trainee-project">
                <h4>${portfolio.project_title}</h4>
                <p>${portfolio.project_description || ''}</p>
                ${portfolio.github_url ? `<a href="${portfolio.github_url}" target="_blank" rel="noopener">View on GitHub →</a>` : ''}
            </div>
            ${isNew ? '<div class="badge badge-success">New</div>' : ''}
            ${actionButtons}
        `;

        // Insert at the beginning
        this.container.insertBefore(card, this.container.firstChild);
    }

    async deletePortfolio(portfolioId) {
        if (!confirm('Are you sure you want to delete this portfolio?')) {
            return;
        }

        try {
            await PortfolioAPI.delete(portfolioId);
            showToast('Portfolio deleted successfully', 'success');
            await this.loadPortfolios();
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            showToast(error.message || 'Failed to delete portfolio', 'error');
        }
    }
}

// Initialize when DOM is ready
let talentPoolUGC;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        talentPoolUGC = new TalentPoolUGC();
        window.talentPoolUGC = talentPoolUGC;
    });
} else {
    talentPoolUGC = new TalentPoolUGC();
    window.talentPoolUGC = talentPoolUGC;
}
