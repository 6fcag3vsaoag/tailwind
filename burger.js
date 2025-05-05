// burger.js
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('#burger');
    const sidebar = document.querySelector('#sidebar');
    const overlay = document.querySelector('#overlay');
    const body = document.body;
    let scrollPosition = [0, 0];
    let isOpen = false; // Переменная для отслеживания состояния меню

    // Функция открытия меню
    function openMenu() {
        scrollPosition = [window.scrollX, window.scrollY];

        // Фиксируем позицию контента
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition[1]}px`;
        body.style.left = `-${scrollPosition[0]}px`;
        body.style.width = '100%';
        body.style.height = '100%';

        // Открываем меню и оверлей
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        overlay.classList.add('opacity-50');
        isOpen = true;
    }

    // Функция закрытия меню
    function closeMenu() {
        // Закрываем меню и оверлей
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
        overlay.classList.remove('opacity-50');

        // Восстанавливаем скролл и убираем фиксацию
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.width = '';
        body.style.height = '';
        window.scrollTo(scrollPosition[0], scrollPosition[1]);
        isOpen = false;
    }

    // Переключение меню по клику на бургер
    burger.addEventListener('click', function() {
        if (!isOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    // Закрытие по клику на оверлей
    overlay.addEventListener('click', function() {
        closeMenu();
    });
});