/**
 * KOICA DX Center Platform - Navigation Component
 * Handles mobile menu, scroll effects, and active link highlighting
 */

class Navigation {
    constructor() {
        this.header = document.querySelector('.header');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        // Handle scroll effects
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu toggle
        if (this.mobileToggle && this.mobileMenu) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());

            // Close menu when clicking nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        this.closeMobileMenu();
                    }
                });
            });

            // Close menu when clicking outside
            this.mobileMenu.addEventListener('click', (e) => {
                if (e.target === this.mobileMenu) {
                    this.closeMobileMenu();
                }
            });
        }

        // Highlight active page
        this.highlightActivePage();
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.header?.classList.add('scrolled');
        } else {
            this.header?.classList.remove('scrolled');
        }
    }

    toggleMobileMenu() {
        this.mobileToggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    highlightActivePage() {
        const currentPath = window.location.pathname;
        this.navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Navigation());
} else {
    new Navigation();
}
