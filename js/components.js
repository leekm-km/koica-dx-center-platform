/**
 * KOICA DX Center Platform - UI Components
 * Reusable JavaScript components for modals, tabs, etc.
 */

// ==================== MODAL COMPONENT ====================
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.backdrop = this.modal?.closest('.modal-backdrop');
        this.init();
    }

    init() {
        if (!this.modal || !this.backdrop) return;

        // Close button
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn?.addEventListener('click', () => this.close());

        // Click outside to close
        this.backdrop.addEventListener('click', (e) => {
            if (e.target === this.backdrop) {
                this.close();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.backdrop.classList.contains('active')) {
                this.close();
            }
        });
    }

    open() {
        this.backdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.backdrop?.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==================== TABS COMPONENT ====================
class Tabs {
    constructor(tabsContainer) {
        this.container = tabsContainer;
        this.tabs = this.container.querySelectorAll('.tab');
        this.contents = this.container.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.switchTab(index));
        });
    }

    switchTab(index) {
        // Remove active class from all tabs and contents
        this.tabs.forEach(tab => tab.classList.remove('active'));
        this.contents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        this.tabs[index].classList.add('active');
        this.contents[index].classList.add('active');
    }
}

// Initialize all tabs on page
function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabContainer => {
        new Tabs(tabContainer.parentElement);
    });
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ==================== INTERSECTION OBSERVER ====================
// Animate elements when they come into view
function observeElements(selector, animationClass) {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
    position: fixed;
    top: calc(var(--header-height) + var(--space-4));
    right: var(--space-4);
    z-index: var(--z-tooltip);
    min-width: 300px;
    animation: slideInRight 0.3s ease-out;
  `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================== SMOOTH SCROLL ====================
function smoothScroll(target, offset = 80) {
    const element = document.querySelector(target);
    if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ==================== EXPORTS ====================
window.Modal = Modal;
window.Tabs = Tabs;
window.animateCounter = animateCounter;
window.observeElements = observeElements;
window.showToast = showToast;
window.smoothScroll = smoothScroll;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
});
