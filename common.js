// Определяем базовый URL для API
window.baseUrl = 'http://localhost:3000';

// Функции авторизации
window.auth = {
    isAuthenticated() {
        return localStorage.getItem('token') !== null;
    },

    checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}; 