// Функция для инициализации темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateThemeText();
}

// Функция для переключения темы
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Обновляем текст и иконки в сайдбаре
    updateThemeText();
    
    // Обновляем логотип
    const logo = document.querySelector('header img[alt="Yellow Kitchen Logo"]');
    if (logo) {
        logo.src = isDark ? 'images/logo_dark.png' : 'images/logo.png';
    }
}

// Функция для обновления текста темы
function updateThemeText() {
    const isDark = document.documentElement.classList.contains('dark');
    const themeText = document.querySelector('#themeText');
    const sunIcon = document.querySelector('#sunIcon');
    const moonIcon = document.querySelector('#moonIcon');
    
    if (themeText) {
        themeText.textContent = isDark ? 'Светлая тема' : 'Темная тема';
    }
    if (sunIcon) {
        sunIcon.classList.toggle('hidden', isDark);
    }
    if (moonIcon) {
        moonIcon.classList.toggle('hidden', !isDark);
    }
}

// Инициализация темы при загрузке страницы
document.addEventListener('DOMContentLoaded', initTheme); 