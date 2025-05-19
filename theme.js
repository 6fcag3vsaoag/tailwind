// Функция для инициализации темы
function initTheme() {
    // Проверяем сохраненную тему в localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Если тема сохранена, применяем её
    if (savedTheme) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
        // Если тема не сохранена, проверяем системные настройки
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
}

// Функция для переключения темы
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Обновляем текст в сайдбаре
    const themeText = document.querySelector('.theme-text');
    if (themeText) {
        themeText.textContent = isDark ? 'Светлая тема' : 'Темная тема';
    }
    
    // Обновляем иконку
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (isDark) {
        sunIcon?.classList.add('hidden');
        moonIcon?.classList.remove('hidden');
    } else {
        sunIcon?.classList.remove('hidden');
        moonIcon?.classList.add('hidden');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initTheme); 