// Функция для обработки клика по бургер-меню
function handleBurgerClick() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const burger = document.getElementById('burger');

    // Переключаем классы для сайдбара
    sidebar.classList.toggle('translate-x-full');
    
    // Переключаем видимость оверлея
    overlay.classList.toggle('hidden');
    overlay.classList.toggle('opacity-0');
    overlay.classList.toggle('pointer-events-none');
    
    // Добавляем/убираем pointer-events для оверлея
    if (overlay.classList.contains('hidden')) {
        overlay.style.pointerEvents = 'none';
    } else {
        overlay.style.pointerEvents = 'auto';
    }
}

// Функция для инициализации обработчиков событий
function initEventListeners() {
    const burger = document.getElementById('burger');
    const overlay = document.getElementById('overlay');

    // Добавляем обработчик клика по бургеру
    burger.addEventListener('click', handleBurgerClick);

    // Добавляем обработчик клика по оверлею
    overlay.addEventListener('click', handleBurgerClick);
}

// Инициализируем обработчики событий при загрузке страницы
document.addEventListener('DOMContentLoaded', initEventListeners); 