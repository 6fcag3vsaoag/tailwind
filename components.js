// Функция создания прелоадера (добавьте в components.js)
function createPreloader() {
    return `
    <div id="preloader" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 60px;
        height: 60px;
        border: 4px solid #fbbf24;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <p style="
        margin-top: 20px;
        font-family: 'Poppins', sans-serif;
        font-size: 1.5rem;
        color: #3f4255;
        font-weight: 600;
      ">YellowKitchen</p>
    </div>`;
  }

// Функция для добавления favicon
function addFavicon() {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'images/sp7.png';
    document.head.appendChild(favicon);
}

// Функция для проверки авторизации
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Функция для проверки роли администратора
function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role === 'admin';
}

// Функция для получения ссылки на профиль/логин
function getProfileLink() {
    return isAuthenticated() ? 'profile.html' : 'login.html';
}

// Функция для выхода из системы
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Функция для создания хедера
function createHeader() {
    return `
    <header class="bg-white flex justify-between items-center py-3 mx-auto relative px-2 transition-colors duration-1000 ease-in-out hover:bg-gray-100 before:absolute before:h-px before:bg-yellow-500 before:w-full before:bottom-0 md:px-23 z-[9999]">
        <a href="index.html" class="text-xl font-bold text-gray-800 relative transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
            <img src="images/logo.svg" alt="Yellow Kitchen Logo" class="h-6 w-auto transition-transform duration-500 hover:rotate-y-180">
        </a>
        <nav class="flex items-center gap-4 md:gap-12">
            <a href="favorites.html" class="text-gray-600 hover:text-yellow-500 relative flex items-center transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                <img src="images/favorite.svg" alt="Favorites Icon" class="h-6 w-6 transition-all duration-500 ease-in-out hover:skew-x-12" />
                <span id="favorites-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform scale-0 transition-transform duration-300">0</span>
            </a>
            <a href="cart.html" class="text-gray-600 hover:text-yellow-500 relative flex items-center transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                <img src="images/cart.svg" alt="Cart Icon" class="h-6 w-6 transition-all duration-500 ease-in-out hover:skew-x-12" />
                <span id="cart-count" class="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform scale-0 transition-transform duration-300">0</span>
            </a>
            <a href="${getProfileLink()}" class="text-gray-600 hover:text-yellow-500 relative flex items-center transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                <img src="images/user.svg" alt="User Icon" class="h-6 w-6 transition-all duration-500 ease-in-out hover:skew-x-12" />
            </a>
            <button id="burger" class="focus:outline-none relative transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 rounded-full hover:shadow-lg hover:shadow-yellow-500/50 animate-pulse">
                <svg class="h-8 w-8 md:h-12 md:w-12 transition-all duration-700 ease-in-out hover:saturate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </nav>
        <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-[url('images/line-sep.png')] bg-repeat-x bg-center"></div>
    </header>`;
}

// Функция для создания футера
function createFooter() {
    return `
    <footer class="bg-[#3f4255] text-white mt-5 mx-auto px-0 sm:px-8 py-6 lg:py-12 flex flex-col justify-between lg:min-h-109.5">
        <div class="grid grid-cols-1 mx-auto md:grid-cols-2 xl:grid-cols-[25fr_20fr_20fr_35fr] gap-6 lg:min-h-70">
            <div class="flex flex-col gap-5 xl:gap-12 lg:pl-15 lg:min-w-120">
                <img src="images/Logo2.svg" alt="Logo" class="h-6 w-auto lg:-ml-29.5 transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-5 hover:hue-rotate-15 hover:brightness-150 hover:saturate-150" />
                <div class="bg-[#d4d7e5] h-px lg:w-74"></div>
                <div class="flex gap-2 justify-center lg:justify-start">
                    <img src="images/app-img1-1.png" alt="App 1" class="h-7.3 w-auto hover:animate-bounce" />
                    <img src="images/app-img2-1.png" alt="App 2" class="h-7.3 w-auto hover:animate-bounce" />
                </div>
            </div>
            <div class="flex flex-col gap-6">
                <p class="[font-family:Poppins,sans-serif] pl-9 lg:text-2xl font-semibold leading-8 text-[white] text-xl mx-auto lg:m-0">About us</p>
                <ul class="flex flex-col gap-4 list-none lg:pl-9 m-0">
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">Concept</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">Franchise</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">Business</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">Restaurant signup</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">For Investors</span>
                    </li>
                </ul>
            </div>
            <div class="flex flex-col gap-6">
                <p class="[font-family:Poppins,sans-serif] pl-8 lg:text-2xl font-semibold leading-8 text-[white] text-xl mx-auto lg:m-0">Get help</p>
                <ul class="flex flex-col gap-4 list-none lg:pl-8 m-0">
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">Read FAQs</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">Restaurants</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">Specialities</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">Sign up to deliver</span>
                    </li>
                    <li class="flex justify-start gap-0 items-center group relative hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]">English</span>
                        <img src="images/down.svg" alt="Dropdown" class="w-6 h-6 pl-1 -mt-0.5 grow-0 shrink-0 basis-auto" />
                    </li>
                </ul>
            </div>
            <div class="flex flex-col gap-6">
                <p class="[font-family:Poppins,sans-serif] lg:pl-7 lg:text-2xl font-semibold leading-8 text-[white] text-xl mx-auto lg:m-0">Contact us</p>
                <ul class="flex flex-col gap-4 list-none lg:pl-7 m-0">
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-80">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-light tracking-[0.50px] text-left leading-6 text-[white] w-[213px]">Yellow kitchen Paris 11</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-80">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-light tracking-[0.50px] text-left leading-6 text-[white] w-[297px]">69 avenue de la Republique 75011 Paris</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-80">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] text-left leading-5 text-[#d4d7e5] w-[297px]">0800 111 126</span>
                    </li>
                    <li class="group relative hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-80">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] text-left leading-5 text-[#d4d7e5] w-[297px]">contact@yellowkitchens.com</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="flex flex-col sm:flex-row justify-between items-center mt-8 pl-15 pr-14">
            <div class="flex gap-6 mb-4 sm:mb-0">
                <a href="#" class="hover:text-yellow-500 hover:animate-bounce relative group after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-full">
                    <img src="Images/insta.svg" alt="Instagram" class="h-6 w-6" />
                </a>
                <a href="#" class="hover:text-yellow-500 hover:animate-bounce relative group after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-full">
                    <img src="Images/twitter.svg" alt="Twitter" class="h-6 w-6" />
                </a>
                <a href="#" class="hover:text-yellow-500 hover:animate-bounce relative group after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-full">
                    <img src="Images/fb.svg" alt="Facebook" class="h-6 w-6" />
                </a>
            </div>
            <div class="flex justify-start grow-0 shrink-0 items-center basis-auto flex-col sm:flex-row gap-4 lg:gap-14">
                <p class="[font-family:'Martel_Sans',sans-serif] text-xs font-extrabold leading-4 text-[white] grow-0 shrink-0 basis-auto m-0 pr-1 inline-block hover:animate-bounce relative group after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-full">Privacy Policy</p>
                <p class="[font-family:'Martel_Sans',sans-serif] text-xs font-extrabold leading-4 text-[white] grow-0 shrink-0 basis-auto m-0 p-0 inline-block hover:animate-bounce relative group after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-full">Terms</p>
                <p class="[font-family:'Martel_Sans',sans-serif] text-xs font-normal leading-4 text-[white] grow-0 shrink-0 basis-auto m-0 p-0 hover:animate-bounce relative group after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-full">© 2020 Yellow kitchen</p>
            </div>
        </div>
    </footer>`;
}

// Функция для создания сайдбара
function createSidebar() {
    return `
    <div id="sidebar" class="fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-[9998]">
        <nav class="flex flex-col p-4 space-y-4 mt-16">
            <a href="index.html" class="text-gray-600 hover:text-yellow-500 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Home</a>
            <a href="catalog.html" class="text-gray-600 hover:text-yellow-500 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Catalog</a>
            <a href="favorites.html" class="text-gray-600 hover:text-yellow-500 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Favorites</a>
            <a href="cart.html" class="text-gray-600 hover:text-yellow-500 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Cart</a>
            <a href="feedback.html" class="text-gray-600 hover:text-yellow-500 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Feedback</a>
            <a href="${getProfileLink()}" class="text-gray-600 hover:text-yellow-500 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">${isAuthenticated() ? 'Профиль' : 'Вход'}</a>
            ${isAuthenticated() ? '<button onclick="logout()" class="text-red-600 hover:text-red-700 relative after:absolute after:h-px after:bg-red-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full text-left">Выйти</button>' : ''}
            ${isAdmin() ? '<a href="admin.html" class="text-gray-600 hover:text-yellow-500 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">Admin</a>' : ''}
        </nav>
    </div>`;
}

// Функция для создания оверлея
function createOverlay() {
    return `
    <div id="overlay" class="fixed inset-0 bg-gray-100 opacity-5 pointer-events-none z-40 hidden"></div>`;
}

// Функция для инициализации компонентов
function initComponents() {
    // прелоадер идет ПЕРВЫМ 
    document.body.insertAdjacentHTML('afterbegin', createPreloader());

    // Блок скролл во время прелоаедар
    document.documentElement.style.overflow = 'hidden';

    // Добавляем favicon
    addFavicon();

    // Добавляем сайдбар
    document.body.insertAdjacentHTML('afterbegin', createSidebar());
    
    // Добавляем оверлей
    document.body.insertAdjacentHTML('afterbegin', createOverlay());
    
    // Добавляем хедер
    document.body.insertAdjacentHTML('afterbegin', createHeader());
    
    // Добавляем футер
    document.body.insertAdjacentHTML('beforeend', createFooter());

    // CSS для анимации прелоадера
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
        to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Удаление прелоадера через 2 секунды
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
        preloader.remove();
        document.documentElement.style.overflow = '';
        }
    }, 1000);

    // Добавляем обновление счетчиков после инициализации компонентов
    updateCounters();
}

// Вызываем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initComponents);

// Используем функции из window.auth
function getAuthLink() {
    return window.auth.isAuthenticated() ? 'profile.html' : 'login.html';
}

// Добавляем функцию для обновления счетчиков
async function updateCounters() {
    const favoritesCount = document.getElementById('favorites-count');
    const cartCount = document.getElementById('cart-count');
    
    if (!window.auth.isAuthenticated()) {
        if (favoritesCount) favoritesCount.style.transform = 'scale(0)';
        if (cartCount) cartCount.style.transform = 'scale(0)';
        return;
    }

    try {
        // Получаем количество избранных товаров
        const favoritesResponse = await fetch(`${window.baseUrl}/favorites`, {
            headers: {
                'Authorization': `Bearer ${window.auth.getToken()}`
            }
        });
        if (favoritesResponse.ok) {
            const favorites = await favoritesResponse.json();
            if (favoritesCount) {
                favoritesCount.textContent = favorites.length;
                favoritesCount.style.transform = favorites.length > 0 ? 'scale(1)' : 'scale(0)';
            }
        }

        // Получаем количество товаров в корзине
        const cartResponse = await fetch(`${window.baseUrl}/cart`, {
            headers: {
                'Authorization': `Bearer ${window.auth.getToken()}`
            }
        });
        if (cartResponse.ok) {
            const cartItems = await cartResponse.json();
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            if (cartCount) {
                cartCount.textContent = totalItems;
                cartCount.style.transform = totalItems > 0 ? 'scale(1)' : 'scale(0)';
            }
        }
    } catch (error) {
        console.error('Error updating counters:', error);
    }
}

// Функция для создания модального окна
function createModal(content, title = '') {
    return `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] hidden" id="modal">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 transform transition-all">
            <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-xl font-semibold text-gray-900">${title}</h3>
                <button onclick="hideModal()" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-4">
                ${content}
            </div>
        </div>
    </div>`;
}

// Функция для создания уведомления
function createNotification(message, type = 'success') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    return `
    <div class="fixed top-4 right-4 transform transition-all duration-300 translate-x-full opacity-0 z-[9999]" id="notification">
        <div class="${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            <span class="mr-2">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>`;
}

// Функция для отображения модального окна
function showModal(content, title = '') {
    // Удаляем существующее модальное окно, если оно есть
    const existingModal = document.getElementById('modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Создаем и добавляем новое модальное окно
    const modal = createModal(content, title);
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Показываем модальное окно
    const modalElement = document.getElementById('modal');
    modalElement.classList.remove('hidden');
    
    // Блокируем прокрутку страницы
    document.body.style.overflow = 'hidden';
}

// Функция для скрытия модального окна
function hideModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.remove();
        // Разблокируем прокрутку страницы
        document.body.style.overflow = '';
    }
}

// Функция для отображения уведомления
function showNotification(message, type = 'success', duration = 3000) {
    // Удаляем существующее уведомление, если оно есть
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем и добавляем новое уведомление
    const notification = createNotification(message, type);
    document.body.insertAdjacentHTML('beforeend', notification);
    
    // Показываем уведомление с анимацией
    const notificationElement = document.getElementById('notification');
    setTimeout(() => {
        notificationElement.classList.remove('translate-x-full', 'opacity-0');
    }, 100);
    
    // Автоматически скрываем уведомление через указанное время
    setTimeout(() => {
        if (notificationElement) {
            notificationElement.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                notificationElement.remove();
            }, 300);
        }
    }, duration);
}

// Функция для создания универсальной карточки товара
function createProductCard(dish, isFavorite = false) {
    return `
    <div class="w-[296px] bg-white rounded-lg overflow-hidden border border-yellow-300 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50 cursor-pointer" onclick="showProductDetail(${dish.id})">
        <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm">
        <div class="p-4 font-['Martel_Sans'] text-[#3f4255]">
            <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3>
            <p class="text-sm mb-2">${dish.description}</p>
            <p class="text-yellow-500 font-bold mb-2">€${dish.price.toFixed(2)}</p>
            <div class="flex justify-between items-center gap-2 mt-2">
                <button class="favorite-btn flex items-center gap-1 ${isFavorite ? 'bg-red-500' : 'bg-yellow-500'} text-white px-2 py-1 rounded w-[120px]" data-dish-id="${dish.id}" onclick="event.stopPropagation(); toggleFavorite(${dish.id})">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    ${isFavorite ? 'Unfavorite' : 'Favorite'}
                </button>
                <div class="flex items-center gap-2">
                    <button class="cart-btn bg-green-500 text-white px-2 py-1 rounded w-[120px] hover:bg-green-600 transition-all duration-300" data-dish-id="${dish.id}" onclick="event.stopPropagation(); addToCart(${dish.id})">
                        to cart
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

// Функция для создания модального окна с детальной информацией о товаре
function createProductDetailModal(dish) {
    return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="relative">
            <img src="${dish.image}" alt="${dish.name}" class="w-full h-64 object-cover rounded-lg">
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-bold text-gray-900">${dish.name}</h2>
            <p class="text-gray-600">${dish.description}</p>
            <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold text-yellow-500">€${dish.price.toFixed(2)}</span>
                <span class="text-sm text-gray-500">/ ${dish.portion}</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-yellow-500">★</span>
                <span class="text-gray-600">${dish.rating}</span>
            </div>
            <div class="flex items-center space-x-4">
                <div class="flex items-center border border-gray-300 rounded">
                    <button class="px-2 py-1 hover:bg-gray-100" onclick="updateQuantity(${dish.id}, getCurrentQuantity(${dish.id}) - 1)">-</button>
                    <span id="modal-quantity-${dish.id}" class="px-2 py-1">${getCurrentQuantity(dish.id)}</span>
                    <button class="px-2 py-1 hover:bg-gray-100" onclick="updateQuantity(${dish.id}, getCurrentQuantity(${dish.id}) + 1)">+</button>
                </div>
                <button onclick="addToCart(${dish.id})" class="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">
                    Добавить в корзину
                </button>
            </div>
        </div>
    </div>`;
}

// Функция для отображения детальной информации о товаре
async function showProductDetail(dishId) {
    try {
        const response = await fetch(`${window.baseUrl}/dishes/${dishId}`);
        if (!response.ok) throw new Error('Failed to fetch dish details');
        const dish = await response.json();
        
        const modalContent = createProductDetailModal(dish);
        showModal(modalContent, dish.name);
    } catch (error) {
        console.error('Error showing product detail:', error);
        showNotification('Ошибка при загрузке информации о товаре', 'error');
    }
}

// Функция для получения текущего количества товара
function getCurrentQuantity(dishId) {
    const quantityElement = document.getElementById(`quantity-${dishId}`);
    return quantityElement ? parseInt(quantityElement.textContent) || 1 : 1;
} 