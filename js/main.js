/**
 * KOICA DX Center Platform - Main JavaScript
 * Homepage specific functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 KOICA DX Center Platform initialized');

    // Initialize counter animations for stats
    initStatsCounters();

    // Initialize intersection observer for animations
    observeElements('.animate-fade-in-up', 'animate-fade-in-up');
    observeElements('.card', 'animate-fade-in');
});

/**
 * Animate statistics counters on homepage
 */
function initStatsCounters() {
    const statValues = document.querySelectorAll('.stat-value[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statValues.forEach(stat => observer.observe(stat));
}
