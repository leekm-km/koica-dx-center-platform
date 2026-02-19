// Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const token = localStorage.getItem('koica-auth-token');
        if (token) {
            this.loadCurrentUser();
        }
    }

    // Load current user from API
    async loadCurrentUser() {
        try {
            const response = await AuthAPI.getMe();
            this.currentUser = response.user;
            this.updateUI();
            return this.currentUser;
        } catch (error) {
            console.error('Failed to load user:', error);
            this.logout();
            return null;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('koica-auth-token');
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Login
    async login(email, password) {
        try {
            const response = await AuthAPI.login(email, password);
            this.currentUser = response.user;
            this.updateUI();
            showToast('Login successful!', 'success');
            return response;
        } catch (error) {
            showToast(error.message || 'Login failed', 'error');
            throw error;
        }
    }

    // Register
    async register(userData) {
        try {
            const response = await AuthAPI.register(userData);
            this.currentUser = response.user;
            this.updateUI();
            showToast('Registration successful!', 'success');
            return response;
        } catch (error) {
            showToast(error.message || 'Registration failed', 'error');
            throw error;
        }
    }

    // Logout
    async logout() {
        try {
            if (this.isAuthenticated()) {
                await AuthAPI.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('koica-auth-token');
            this.currentUser = null;
            this.updateUI();
            showToast('Logged out successfully', 'info');
            // Redirect to home
            window.location.href = 'index.html';
        }
    }

    // Update UI based on auth state
    updateUI() {
        // Update navigation buttons
        const loginButtons = document.querySelectorAll('.nav-login-btn');
        const logoutButtons = document.querySelectorAll('.nav-logout-btn');
        const userInfo = document.querySelectorAll('.nav-user-info');

        if (this.isAuthenticated() && this.currentUser) {
            // Hide login buttons
            loginButtons.forEach(btn => btn.style.display = 'none');

            // Show logout buttons
            logoutButtons.forEach(btn => btn.style.display = 'inline-flex');

            // Show user info
            userInfo.forEach(elem => {
                elem.style.display = 'inline-flex';
                elem.textContent = this.currentUser.fullName || this.currentUser.email;
            });
        } else {
            // Show login buttons
            loginButtons.forEach(btn => btn.style.display = 'inline-flex');

            // Hide logout buttons
            logoutButtons.forEach(btn => btn.style.display = 'none');

            // Hide user info
            userInfo.forEach(elem => elem.style.display = 'none');
        }
    }

    // Protect page (redirect to login if not authenticated)
    protectPage() {
        if (!this.isAuthenticated()) {
            window.location.href = 'lms.html';
        }
    }

    // Check if current user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Check if user has required permission
    hasPermission(requiredRole) {
        if (!this.currentUser) return false;
        if (requiredRole === 'admin') {
            return this.currentUser.role === 'admin';
        }
        // Can extend with more roles: employer, student, etc.
        return true;
    }
}

// Toast notification helper
function showToast(message, type = 'info') {
    // Check if toast container exists
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        margin-bottom: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    toast.textContent = message;

    // Add to container
    toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for toast animations
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Create global auth manager instance
const authManager = new AuthManager();

// Expose globally
window.authManager = authManager;
window.showToast = showToast;
