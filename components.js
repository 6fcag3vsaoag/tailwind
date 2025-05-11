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
            <a href="feedback.html" class="text-gray-600 hover:text-yellow-500 relative flex items-center transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                <img src="images/feedback.svg" alt="Feedback Icon" class="h-6 w-6 transition-all duration-500 ease-in-out hover:skew-x-12" />
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
    <div id="overlay" class="fixed inset-0 bg-black opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out z-40 hidden"></div>`;
}

// Функция для инициализации компонентов
function initComponents() {
    // Добавляем сайдбар
    document.body.insertAdjacentHTML('afterbegin', createSidebar());
    
    // Добавляем оверлей
    document.body.insertAdjacentHTML('afterbegin', createOverlay());
    
    // Добавляем хедер
    document.body.insertAdjacentHTML('afterbegin', createHeader());
    
    // Добавляем футер
    document.body.insertAdjacentHTML('beforeend', createFooter());
}

// Вызываем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initComponents); 