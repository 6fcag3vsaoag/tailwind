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
    const isDark = document.documentElement.classList.contains('dark');
    return `
    <header class="bg-white dark:bg-dark-bg flex justify-between items-center py-3 mx-auto relative px-20 transition-colors duration-1000 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800 before:absolute before:h-px before:bg-yellow-500 before:w-full before:bottom-0 md:px-23 z-[10000]"
        style="position:fixed; top:0; left:0; width:100%; z-index:10000; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
        <a href="index.html" class="text-xl font-bold text-gray-800 dark:text-gray-200 relative transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
            <img src="${isDark ? 'images/Logo.svg' : 'images/Logo2.svg'}" alt="Yellow Kitchen Logo" class="h-6 w-auto transition-transform duration-500 hover:rotate-y-180">
        </a>
        <nav class="flex items-center gap-4 md:gap-12">
            <a href="favorites.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative flex items-center transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 after:absolute after:h-px after:bg-yellow-500 dark:after:bg-yellow-400 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                <svg class="h-6 w-6 transition-all duration-500 ease-in-out hover:skew-x-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span id="favorites-count" class="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform scale-0 transition-transform duration-300">0</span>
            </a>
            <a href="cart.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative flex items-center transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 after:absolute after:h-px after:bg-yellow-500 dark:after:bg-yellow-400 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                <svg class="h-6 w-6 transition-all duration-500 ease-in-out hover:skew-x-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span id="cart-count" class="absolute -top-2 -right-2 bg-green-500 dark:bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform scale-0 transition-transform duration-300">0</span>
            </a>
            <button onclick="showUserProfile()" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative flex items-center transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 after:absolute after:h-px after:bg-yellow-500 dark:after:bg-yellow-400 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full">
                <svg class="h-6 w-6 transition-all duration-500 ease-in-out hover:skew-x-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </button>
            <button id="burger" class="focus:outline-none relative transition-transform duration-300 ease-in-out hover:scale-125 active:scale-125 rounded-full hover:shadow-lg hover:shadow-yellow-500/50 dark:hover:shadow-yellow-400/30 animate-pulse">
                <svg class="h-8 w-8 md:h-12 md:w-12 transition-all duration-700 ease-in-out hover:saturate-200 dark:text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
    <footer class="bg-[#3f4255] dark:bg-gray-900 text-white mt-5 mx-auto px-20 sm:px-8 py-6 lg:py-12 flex flex-col justify-between lg:min-h-109.5">
        <div class="grid grid-cols-1 mx-auto md:grid-cols-2 xl:grid-cols-[25fr_20fr_20fr_35fr] gap-6 lg:min-h-70">
            <div class="flex flex-col gap-5 xl:gap-12 lg:pl-15 lg:min-w-120">
                <img src="images/Logo2.svg" alt="Logo" class="h-6 w-auto lg:-ml-29.5 transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-5 hover:hue-rotate-15 hover:brightness-150 hover:saturate-150" />
                <div class="bg-[#d4d7e5] dark:bg-gray-700 h-px lg:w-74"></div>
                <div class="flex gap-2 justify-center lg:justify-start">
                    <img src="images/app-img1-1.png" alt="App 1" class="h-7.3 w-auto hover:animate-bounce" />
                    <img src="images/app-img2-1.png" alt="App 2" class="h-7.3 w-auto hover:animate-bounce" />
                </div>
            </div>
            <div class="flex flex-col gap-6">
                <p class="[font-family:Poppins,sans-serif] pl-9 lg:text-2xl font-semibold leading-8 text-[white] text-xl mx-auto lg:m-0" data-i18n="about-us">About us</p>
                <ul class="flex flex-col gap-4 list-none lg:pl-9 m-0">
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5] dark:text-gray-300" data-i18n="concept">Concept</span>
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]" data-i18n="concept">Concept</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]" data-i18n="franchise">Franchise</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]" data-i18n="business">Business</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]" data-i18n="restaurant-signup">Restaurant signup</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]" data-i18n="for-investors">For Investors</span>
                    </li>
                </ul>
            </div>
            <div class="flex flex-col gap-6">
                <p class="[font-family:Poppins,sans-serif] pl-8 lg:text-2xl font-semibold leading-8 text-[white] text-xl mx-auto lg:m-0" data-i18n="get-help">Get help</p>
                <ul class="flex flex-col gap-4 list-none lg:pl-8 m-0">
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]" data-i18n="read-faqs">Read FAQs</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]" data-i18n="restaurants">Restaurants</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]" data-i18n="specialties">Specialities</span>
                    </li>
                    <li class="group relative inline-block hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <span class="[font-family:'Martel_Sans',sans-serif] text-base font-bold tracking-[0.50px] leading-5 text-[#d4d7e5]" data-i18n="signup-deliver">Sign up to deliver</span>
                    </li>
                    <li class="flex justify-start gap-0 items-center group relative hover:animate-bounce after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-40">
                        <div class="language-switcher relative cursor-pointer">
                            <div class="flex items-center gap-2">
                                <span class="text-[#d4d7e5]">English</span>
                                <img src="images/down.svg" alt="Dropdown" class="w-6 h-6 pl-1 -mt-0.5">
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="flex flex-col gap-6">
                <p class="[font-family:Poppins,sans-serif] lg:pl-7 lg:text-2xl font-semibold leading-8 text-[white] text-xl mx-auto lg:m-0" data-i18n="contact-us">Contact us</p>
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
                <p class="[font-family:'Martel_Sans',sans-serif] text-xs font-extrabold leading-4 text-[white] grow-0 shrink-0 basis-auto m-0 pr-1 inline-block hover:animate-bounce relative group after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-full" data-i18n="privacy-policy">Privacy Policy</p>
                <p class="[font-family:'Martel_Sans',sans-serif] text-xs font-extrabold leading-4 text-[white] grow-0 shrink-0 basis-auto m-0 p-0 inline-block hover:animate-bounce relative group after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-full" data-i18n="terms">Terms</p>
                <p class="[font-family:'Martel_Sans',sans-serif] text-xs font-normal leading-4 text-[white] grow-0 shrink-0 basis-auto m-0 p-0 hover:animate-bounce relative group after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:rounded transition-all duration-300 hover:after:w-full" data-i18n="copyright">© 2020 Yellow kitchen</p>
            </div>
        </div>
    </footer>`;
}

// Функция для создания сайдбара
function createSidebar() {
    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : (localStorage.getItem('language') || 'en');
    const isDark = document.documentElement.classList.contains('dark');
    
    return `
    <div id="sidebar" class="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-[9998]">
        <nav class="flex flex-col p-4 space-y-4 mt-16">
            <a href="index.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full" data-i18n="home">${i18Obj[lang]['home'] || 'Home'}</a>
            <a href="catalog.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full" data-i18n="catalog">${i18Obj[lang]['catalog'] || 'Catalog'}</a>
            <a href="favorites.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full" data-i18n="favorites">${i18Obj[lang]['favorites'] || 'Favorites'}</a>
            <a href="cart.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full" data-i18n="cart">${i18Obj[lang]['cart'] || 'Cart'}</a>
            <a href="feedback.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full" data-i18n="feedback">${i18Obj[lang]['feedback'] || 'Feedback'}</a>
            <a href="about_us.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full" data-i18n="about-us">${i18Obj[lang]['about-us'] || 'About us'}</a>
            <a href="gallery.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full" data-i18n="gallery">${i18Obj[lang]['gallery'] || 'Gallery'}</a>
            <a href="${getProfileLink()}" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full" data-i18n="${isAuthenticated() ? 'profile' : 'login'}">${i18Obj[lang][isAuthenticated() ? 'profile' : 'login'] || (isAuthenticated() ? 'Профиль' : 'Вход')}</a>
            ${isAuthenticated() ? `<button onclick="logout()" class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 relative after:absolute after:h-px after:bg-red-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full text-left" data-i18n="logout">${i18Obj[lang]['logout'] || 'Выйти'}</button>` : ''}
            ${isAdmin() ? `<a href="admin.html" class="text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 relative after:absolute after:h-px after:bg-yellow-500 after:w-0 after:bottom-0 after:left-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full" data-i18n="admin">${i18Obj[lang]['admin'] || 'Admin'}</a>` : ''}
            
            <!-- Переключатель темы -->
            <div class="theme-toggle-container flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button onclick="toggleTheme()" class="theme-toggle flex items-center gap-2 text-gray-600 dark:text-gray-200 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300 w-full">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path id="sunIcon" class="${isDark ? 'hidden' : ''}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        <path id="moonIcon" class="${!isDark ? 'hidden' : ''}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span id="themeText">${isDark ? 'Светлая тема' : 'Темная тема'}</span>
                </button>
            </div>
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

// Инициализация объекта auth
window.auth = {
    // Проверка авторизации
    isAuthenticated() {
        return localStorage.getItem('token') !== null;
    },

    // Получение текущего пользователя
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Получение токена
    getToken() {
        return localStorage.getItem('token');
    },

    // Сохранение данных пользователя после входа
    setUserData(data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    },

    // Выход из системы
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
};

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
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 transform transition-all">
            <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">${title}</h3>
                <button onclick="hideModal()" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
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
        info: 'bg-blue-500',
        cart: 'bg-green-500',
        favorite: 'bg-red-500'
    };
    
    const icons = {
        success: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`,
        error: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>`,
        warning: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>`,
        info: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        cart: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>`,
        favorite: `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>`
    };
    
    return `
    <div class="fixed top-4 right-4 transform transition-all duration-300 translate-x-full opacity-0 z-[9999]" id="notification">
        <div class="${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
            ${icons[type]}
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
    requestAnimationFrame(() => {
        notificationElement.classList.remove('translate-x-full', 'opacity-0');
    });
    
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
    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : (localStorage.getItem('language') || 'en');
    const addToCartText = i18Obj[lang]['add-to-cart'] || 'to cart';
    const removeFromFavoritesText = i18Obj[lang]['remove-from-favorites'] || 'Unfavorite';
    const addToFavoritesText = i18Obj[lang]['add-to-favorites'] || 'Favorite';
    return `
    <div class="w-[296px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-yellow-300 dark:border-yellow-400 shadow-md transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sm hover:shadow-yellow-500/50 dark:hover:shadow-yellow-400/30 cursor-pointer" onclick="showProductDetail(${dish.id})">
        <img src="${dish.image}" alt="${dish.name}" class="w-full h-[184px] object-cover transition-all duration-500 ease-in-out hover:blur-sm dark:brightness-90">
        <div class="p-4 font-['Martel_Sans'] text-[#3f4255] dark:text-gray-200">
            <h3 class="font-['Poppins'] text-lg font-semibold mb-2">${dish.name}</h3>
            <p class="text-sm mb-2">${dish.description}</p>
            <p class="text-yellow-500 dark:text-yellow-400 font-bold mb-2">€${dish.price.toFixed(2)}</p>
            <div class="flex justify-between items-center gap-2 mt-2">
                <button class="favorite-btn flex items-center gap-1 ${isFavorite ? 'bg-red-500 dark:bg-red-600' : 'bg-yellow-500 dark:bg-yellow-600'} text-white px-2 py-1 rounded w-[120px]" data-dish-id="${dish.id}" onclick="event.stopPropagation(); toggleFavorite(${dish.id})">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    ${isFavorite ? removeFromFavoritesText : addToFavoritesText}
                </button>
                <div class="flex items-center gap-2">
                    <button class="cart-btn bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded w-[120px] hover:bg-green-600 dark:hover:bg-green-700 transition-all duration-300" data-dish-id="${dish.id}" onclick="event.stopPropagation(); addToCart(${dish.id})">
                        ${addToCartText}
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
            <img src="${dish.image}" alt="${dish.name}" class="w-full h-64 object-cover rounded-lg dark:brightness-90">
        </div>
        <div class="space-y-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">${dish.name}</h2>
            <p class="text-gray-600 dark:text-gray-300">${dish.description}</p>
            <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold text-yellow-500 dark:text-yellow-400">€${dish.price.toFixed(2)}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">/ ${dish.portion}</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-yellow-500 dark:text-yellow-400">★</span>
                <span class="text-gray-600 dark:text-gray-300">${dish.rating}</span>
            </div>
            <div class="flex items-center space-x-4">
                <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                    <button class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200" onclick="updateQuantity(${dish.id}, getCurrentQuantity(${dish.id}) - 1)">-</button>
                    <span id="modal-quantity-${dish.id}" class="px-2 py-1 dark:text-gray-200">${getCurrentQuantity(dish.id)}</span>
                    <button class="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200" onclick="updateQuantity(${dish.id}, getCurrentQuantity(${dish.id}) + 1)">+</button>
                </div>
                <button onclick="addToCart(${dish.id})" class="flex-1 bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors">
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

function initLanguageSwitcher() {
    const langSwitcher = document.querySelector('.language-switcher');
    if (langSwitcher) {
        const currentLang = getCurrentLang();
        langSwitcher.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-[#d4d7e5]">${currentLang === 'en' ? 'English' : currentLang === 'ru' ? 'Русский' : '中文'}</span>
                <img src="images/down.svg" alt="Dropdown" class="w-6 h-6 pl-1 -mt-0.5">
            </div>
            <div class="language-dropdown hidden absolute top-full left-0 bg-white shadow-lg rounded-md mt-1">
                <button onclick="setLang('en')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">English</button>
                <button onclick="setLang('ru')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Русский</button>
                <button onclick="setLang('zh')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">中文</button>
            </div>
        `;
        // ... остальной код ...
    }
}

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
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// Создаем компонент переключателя темы
function createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300';
    toggle.innerHTML = `
        <svg class="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path class="sun-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            <path class="moon-icon hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    `;
    
    toggle.addEventListener('click', () => {
        toggleTheme();
        updateToggleIcon();
    });
    
    document.body.appendChild(toggle);
    updateToggleIcon();
}

// Функция для обновления иконки переключателя
function updateToggleIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (isDark) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    createThemeToggle();
});

// Функция для создания модального окна профиля пользователя
function createProfileModal(user) {
    return `
    <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Имя</label>
                <input type="text" id="firstName" value="${user.firstName || ''}" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Фамилия</label>
                <input type="text" id="lastName" value="${user.lastName || ''}" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Отчество</label>
                <input type="text" id="middleName" value="${user.middleName || ''}" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" id="email" value="${user.email || ''}" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Телефон</label>
                <input type="tel" id="phone" value="${user.phone || ''}" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Дата рождения</label>
                <input type="date" id="birthDate" value="${user.birthDate || ''}" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            </div>
        </div>
        <div class="flex justify-between pt-4">
            <button onclick="resetUserSettings()" class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Сбросить настройки
            </button>
            <button onclick="saveUserProfile()" class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                Сохранить изменения
            </button>
        </div>
    </div>`;
}

// Функция для отображения профиля пользователя
async function showUserProfile() {
    if (!window.auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const currentUser = window.auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('User data not found');
        }

        const response = await fetch(`${window.baseUrl}/users/${currentUser.id}`, {
            headers: {
                'Authorization': `Bearer ${window.auth.getToken()}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const user = await response.json();
        const modalContent = createProfileModal(user);
        showModal(modalContent, 'Профиль пользователя');
    } catch (error) {
        console.error('Error showing user profile:', error);
        showNotification('Ошибка при загрузке профиля', 'error');
    }
}

// Функция для сохранения профиля пользователя
async function saveUserProfile() {
    try {
        const currentUser = window.auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('User data not found');
        }

        const userData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            middleName: document.getElementById('middleName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            birthDate: document.getElementById('birthDate').value
        };

        const response = await fetch(`${window.baseUrl}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.auth.getToken()}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error('Failed to update user data');

        // Обновляем данные пользователя в localStorage
        const updatedUser = await response.json();
        const currentUserData = window.auth.getCurrentUser();
        currentUserData.firstName = updatedUser.firstName;
        currentUserData.lastName = updatedUser.lastName;
        currentUserData.middleName = updatedUser.middleName;
        currentUserData.email = updatedUser.email;
        currentUserData.phone = updatedUser.phone;
        currentUserData.birthDate = updatedUser.birthDate;
        localStorage.setItem('user', JSON.stringify(currentUserData));

        showNotification('Профиль успешно обновлен', 'success');
        hideModal();
    } catch (error) {
        console.error('Error saving user profile:', error);
        showNotification('Ошибка при сохранении профиля', 'error');
    }
}

// Функция для сброса настроек пользователя
async function resetUserSettings() {
    if (!confirm('Вы уверены, что хотите сбросить все настройки профиля?')) {
        return;
    }

    try {
        const currentUser = window.auth.getCurrentUser();
        if (!currentUser) {
            throw new Error('User data not found');
        }

        const response = await fetch(`${window.baseUrl}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.auth.getToken()}`
            },
            body: JSON.stringify({
                firstName: '',
                lastName: '',
                middleName: '',
                phone: '',
                birthDate: ''
            })
        });

        if (!response.ok) throw new Error('Failed to reset user settings');

        // Обновляем данные пользователя в localStorage
        const updatedUser = await response.json();
        const currentUserData = window.auth.getCurrentUser();
        currentUserData.firstName = '';
        currentUserData.lastName = '';
        currentUserData.middleName = '';
        currentUserData.phone = '';
        currentUserData.birthDate = '';
        localStorage.setItem('user', JSON.stringify(currentUserData));

        showNotification('Настройки успешно сброшены', 'success');
        hideModal();
    } catch (error) {
        console.error('Error resetting user settings:', error);
        showNotification('Ошибка при сбросе настроек', 'error');
    }
} 