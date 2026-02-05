/**
 * API Configuration for Split Deployment
 * Automatically handles switching between local and production backend URLs
 */
const API_CONFIG = {
    // Render backend URL
    // Render backend URL
    PRODUCTION_API_URL: 'https://booking-fago.onrender.com',

    // Local development backend URL
    DEVELOPMENT_API_URL: 'http://localhost:3000',

    /**
     * Returns the appropriate base URL for API requests
     */
    getApiBaseUrl: function () {
        // If we're on localhost or have no production URL set, use development URL
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            !this.PRODUCTION_API_URL) {
            return this.DEVELOPMENT_API_URL;
        }
        return this.PRODUCTION_API_URL;
    }
};

// Make it globally accessible
window.API_BASE_URL = API_CONFIG.getApiBaseUrl();
console.log('📡 API Base URL configured:', window.API_BASE_URL);
