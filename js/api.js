// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// API Helper class
class API {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('koica-auth-token');
    }

    // Get authorization headers
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Handle API response
    async handleResponse(response) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'API request failed');
        }

        return data;
    }

    // GET request
    async get(endpoint, requiresAuth = false) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(requiresAuth)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`GET ${endpoint} failed:`, error);
            throw error;
        }
    }

    // POST request
    async post(endpoint, data = {}, requiresAuth = false) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(requiresAuth),
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`POST ${endpoint} failed:`, error);
            throw error;
        }
    }

    // PUT request
    async put(endpoint, data = {}, requiresAuth = false) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(requiresAuth),
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`PUT ${endpoint} failed:`, error);
            throw error;
        }
    }

    // DELETE request
    async delete(endpoint, requiresAuth = false) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(requiresAuth)
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error(`DELETE ${endpoint} failed:`, error);
            throw error;
        }
    }

    // Update token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('koica-auth-token', token);
        } else {
            localStorage.removeItem('koica-auth-token');
        }
    }
}

// Create singleton instance
const api = new API();

// Auth API functions
const AuthAPI = {
    // Register new user
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.token) {
            api.setToken(response.token);
        }
        return response;
    },

    // Login user
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.token) {
            api.setToken(response.token);
        }
        return response;
    },

    // Logout user
    async logout() {
        const response = await api.post('/auth/logout', {}, true);
        api.setToken(null);
        return response;
    },

    // Get current user
    async getMe() {
        return await api.get('/auth/me', true);
    }
};

// User API functions
const UserAPI = {
    // Get user profile
    async getProfile() {
        return await api.get('/users/profile', true);
    },

    // Update user profile
    async updateProfile(profileData) {
        return await api.put('/users/profile', profileData, true);
    },

    // Update password
    async updatePassword(currentPassword, newPassword) {
        return await api.put('/users/password', {
            currentPassword,
            newPassword
        }, true);
    }
};

// Portfolio API functions
const PortfolioAPI = {
    // Create a new portfolio
    async create(portfolioData) {
        return await api.post('/portfolios', portfolioData, true);
    },

    // Get all portfolios
    async getAll(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/portfolios?${queryParams}` : '/portfolios';
        return await api.get(endpoint);
    },

    // Get a specific portfolio
    async getById(id) {
        return await api.get(`/portfolios/${id}`);
    },

    // Get my portfolios (requires auth)
    async getMine() {
        return await api.get('/portfolios/me/all', true);
    },

    // Update portfolio (requires auth)
    async update(id, portfolioData) {
        return await api.put(`/portfolios/${id}`, portfolioData, true);
    },

    // Delete portfolio (requires auth)
    async delete(id) {
        return await api.delete(`/portfolios/${id}`, true);
    }
};

// Job API functions
const JobAPI = {
    // Create a new job
    async create(jobData) {
        return await api.post('/jobs', jobData, true);
    },

    // Get all jobs
    async getAll(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/jobs?${queryParams}` : '/jobs';
        return await api.get(endpoint);
    },

    // Get a specific job
    async getById(id) {
        return await api.get(`/jobs/${id}`);
    },

    // Get my jobs (requires auth)
    async getMine() {
        return await api.get('/jobs/me/all', true);
    },

    // Update job (requires auth)
    async update(id, jobData) {
        return await api.put(`/jobs/${id}`, jobData, true);
    },

    // Delete job (requires auth)
    async delete(id) {
        return await api.delete(`/jobs/${id}`, true);
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, AuthAPI, UserAPI, PortfolioAPI, JobAPI };
}
