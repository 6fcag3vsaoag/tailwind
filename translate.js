// Объект с переводами
const i18Obj = {
    'en': {
        // Header
        'favorites': 'Favorites',
        'cart': 'Cart',
        'profile': 'Profile',
        'login': 'Login',
        'logout': 'Logout',
        'admin': 'Admin',

        // Main page
        'your-food-court': 'Your Food court at home',
        'delivery': 'Delivery',
        'order-in': 'Order in',
        'takeout': 'Takeout',
        'grab-and-go': 'Grab and go',
        'delivery-time': 'delivery in all paris in less than 30 minutes',
        'free-delivery': 'Free delivery from 29 euros',
        'fresh-products': 'Only fresh and French products',
        'restaurants': 'Restaurants',
        'show-all': 'show all',
        'nearest-restaurants': 'Your nearest restaurants',
        'delivery-area': 'Each kitchen works with its own delivery area to deliver food to you as soon as possible',
        'enter-address': 'Enter delivery address',
        'send': 'send',
        'specialties': 'Specialities',
        'statistics-kitchen': 'kitchen',
        'statistics-specialties': 'specialties',
        'statistics-restaurants': 'restaurants',
        'statistics-transport': 'transport costs',
        'instagram': 'in instagram',
        'bagel': 'Bagel',
        'burger': 'Burger',
        'chicken': 'Chicken',
        'fish': 'Fish',
        'fish-chips': 'Fish\'Chips',
        'pizza': 'Pizza',
        'salad': 'Salad',
        'sushi': 'Sushi',
        // Footer
        'about-us': 'About us',
        'concept': 'Concept',
        'franchise': 'Franchise',
        'business': 'Business',
        'restaurant-signup': 'Restaurant signup',
        'for-investors': 'For Investors',
        'get-help': 'Get help',
        'read-faqs': 'Read FAQs',
        'restaurants': 'Restaurants',
        'specialties': 'Specialities',
        'signup-deliver': 'Sign up to deliver',
        'contact-us': 'Contact us',
        'privacy-policy': 'Privacy Policy',
        'terms': 'Terms',
        'copyright': '© 2020 Yellow kitchen',
        // Catalog translations
        'catalog-title': 'Yellow Kitchen - Catalog',
        'search-placeholder': 'Search by name or description',
        'sort-default': 'Sort by...',
        'sort-name': 'Name (A-Z)',
        'sort-price': 'Price (Low to High)',
        'sort-rating': 'Rating (High to Low)',
        'items-4': '4 per page',
        'items-8': '8 per page',
        'items-12': '12 per page',
        'items-all': 'All',
        'category-all': 'All',
        'category-burger': 'Burger',
        'category-pasta': 'Pasta',
        'category-sushi': 'Sushi',
        'category-pizza': 'Pizza',
        'category-salad': 'Salad',
        'price-min': 'Min Price',
        'price-max': 'Max Price',
        'rating-min': 'Min Rating',
        'rating-max': 'Max Rating',
        'array-map': 'Map: Capitalize Names',
        'array-filter': 'Filter: Price < €20',
        'array-reduce': 'Reduce: Total Price',
        'array-sort': 'Sort: Price Desc',
        'array-slice': 'Slice: First 5',
        'array-find': 'Find: Rating 5',
        'array-some': 'Some: Price < €10',
        'array-every': 'Every: Rating > 3',
        'array-forEach': 'ForEach: Log Names',
        'array-concat': 'Concat: Add Sample Dish',
        // Dynamic content translations
        'add-to-cart': 'Add to Cart',
        'remove-from-cart': 'Remove from Cart',
        'add-to-favorites': 'Add to Favorites',
        'remove-from-favorites': 'Remove from Favorites',
        'price': 'Price',
        'rating': 'Rating',
        'no-items': 'No items found',
        'loading': 'Loading...',
        'error': 'Error loading items',
        'currency': '€',
        'stars': 'stars',
        'page': 'Page',
        'of': 'of',
        'next': 'Next',
        'prev': 'Previous',
        'first': 'First',
        'last': 'Last',
        'cart-title': 'Yellow Kitchen - Cart',
        'checkout': 'Checkout',
        'favorites-title': 'Yellow Kitchen - Favorites',
        'feedback-title': 'Yellow Kitchen - Feedback',
        'leave-feedback': 'Leave Feedback',
        'select-dish-label': 'Select a dish',
        'select-dish-placeholder': 'Select a dish',
        'rating-label': 'Rating',
        'comment-label': 'Comment',
        'comment-placeholder': 'Write your review (at least 10 characters)',
        'send-feedback': 'Send Feedback',
        'admin-title': 'Yellow Kitchen - Admin Panel',
        'admin-dishes-tab': 'Manage Dishes',
        'admin-feedback-tab': 'Manage Feedback',
        'admin-add-dish': 'Add New Dish',
        'admin-dish-name': 'Name <span class="text-red-500">*</span>',
        'admin-dish-description': 'Description <span class="text-red-500">*</span>',
        'admin-dish-price': 'Price <span class="text-red-500">*</span>',
        'admin-dish-category': 'Category <span class="text-red-500">*</span>',
        'admin-dish-category-placeholder': 'Select category',
        'admin-dish-image': 'Image <span class="text-red-500">*</span>',
        'admin-add-dish-btn': 'Add Dish',
        'admin-dishes-list': 'Dish List',
        'admin-feedback-title': 'Manage Feedback',
        'admin-user-filter': 'User Filter',
        'admin-user-filter-placeholder': 'All users',
        'about-title': 'About Us - Yellow Kitchen',
        'about-story-title': 'Our Story',
        'about-story-text': 'Yellow Kitchen started in 2010 as a small family bakery. Since then, we have grown into one of the most famous pastry shops in the city, while maintaining the warmth and comfort of homemade pastries.',
        'about-values-title': 'Our Values',
        'about-values-text': 'We believe in quality, tradition, and innovation. Each of our products is made with love and care, using only the best ingredients and time-tested recipes.',
        'about-future-title': 'Our Future',
        'about-future-text': 'We continue to grow and delight our customers with new flavors and ideas. Our goal is to become the best pastry shop in the city, while maintaining the soul and quality of homemade pastries.'
    },
    'ru': {
        // Header
        'favorites': 'Избранное',
        'cart': 'Корзина',
        'profile': 'Профиль',
        'login': 'Вход',
        'logout': 'Выйти',
        'admin': 'Админ',

        // Main page
        'your-food-court': 'Ваш фуд-корт дома',
        'delivery': 'Доставка',
        'order-in': 'Заказать',
        'takeout': 'С собой',
        'grab-and-go': 'Забрать',
        'delivery-time': 'доставка по всему Парижу менее чем за 30 минут',
        'free-delivery': 'Бесплатная доставка от 29 евро',
        'fresh-products': 'Только свежие и французские продукты',
        'restaurants': 'Рестораны',
        'show-all': 'показать все',
        'nearest-restaurants': 'Ближайшие рестораны',
        'delivery-area': 'Каждая кухня работает в своей зоне доставки, чтобы доставить еду вам как можно быстрее',
        'enter-address': 'Введите адрес доставки',
        'send': 'отправить',
        'specialties': 'Специальности',
        'statistics-kitchen': 'кухня',
        'statistics-specialties': 'специальности',
        'statistics-restaurants': 'рестораны',
        'statistics-transport': 'стоимость доставки',
        'instagram': 'в инстаграме',
        'bagel': 'булка',
        'burger': 'бургер',
        'chicken': 'курица',
        'fish': 'рыба',
        'fish-chips': 'рыбные чипсы',
        'pizza': 'пицца',
        'salad': 'салат',
        'sushi': 'суши',

        // Footer
        'about-us': 'О нас',
        'concept': 'Концепция',
        'franchise': 'Франшиза',
        'business': 'Бизнес',
        'restaurant-signup': 'Регистрация ресторана',
        'for-investors': 'Для инвесторов',
        'get-help': 'Помощь',
        'read-faqs': 'Читать FAQ',
        'restaurants': 'Рестораны',
        'specialties': 'Специальности',
        'signup-deliver': 'Стать курьером',
        'contact-us': 'Связаться с нами',
        'privacy-policy': 'Политика конфиденциальности',
        'terms': 'Условия',
        'copyright': '© 2020 Yellow kitchen',
        // Catalog translations
        'catalog-title': 'Yellow Kitchen - Каталог',
        'search-placeholder': 'Поиск по названию или описанию',
        'sort-default': 'Сортировать по...',
        'sort-name': 'Название (А-Я)',
        'sort-price': 'Цена (по возрастанию)',
        'sort-rating': 'Рейтинг (по убыванию)',
        'items-4': '4 на странице',
        'items-8': '8 на странице',
        'items-12': '12 на странице',
        'items-all': 'Все',
        'category-all': 'Все',
        'category-burger': 'Бургеры',
        'category-pasta': 'Паста',
        'category-sushi': 'Суши',
        'category-pizza': 'Пицца',
        'category-salad': 'Салаты',
        'price-min': 'Мин. цена',
        'price-max': 'Макс. цена',
        'rating-min': 'Мин. рейтинг',
        'rating-max': 'Макс. рейтинг',
        'array-map': 'Map: Заглавные буквы',
        'array-filter': 'Filter: Цена < €20',
        'array-reduce': 'Reduce: Общая цена',
        'array-sort': 'Sort: Цена по убыванию',
        'array-slice': 'Slice: Первые 5',
        'array-find': 'Find: Рейтинг 5',
        'array-some': 'Some: Цена < €10',
        'array-every': 'Every: Рейтинг > 3',
        'array-forEach': 'ForEach: Лог имен',
        'array-concat': 'Concat: Добавить блюдо',
        // Dynamic content translations
        'add-to-cart': 'В корзину',
        'remove-from-cart': 'Удалить из корзины',
        'add-to-favorites': 'В избранное',
        'remove-from-favorites': 'Удалить из избранного',
        'price': 'Цена',
        'rating': 'Рейтинг',
        'no-items': 'Товары не найдены',
        'loading': 'Загрузка...',
        'error': 'Ошибка загрузки товаров',
        'currency': '€',
        'stars': 'звезд',
        'page': 'Страница',
        'of': 'из',
        'next': 'Следующая',
        'prev': 'Предыдущая',
        'first': 'Первая',
        'last': 'Последняя',
        'cart-title': 'Yellow Kitchen - Корзина',
        'checkout': 'Оформить заказ',
        'favorites-title': 'Yellow Kitchen - Избранное',
        'feedback-title': 'Yellow Kitchen - Отзывы',
        'leave-feedback': 'Оставить отзыв',
        'select-dish-label': 'Выберите блюдо',
        'select-dish-placeholder': 'Выберите блюдо',
        'rating-label': 'Оценка',
        'comment-label': 'Комментарий',
        'comment-placeholder': 'Напишите ваш отзыв (минимум 10 символов)',
        'send-feedback': 'Отправить отзыв',
        'admin-title': 'Yellow Kitchen - Админ-панель',
        'admin-dishes-tab': 'Управление товарами',
        'admin-feedback-tab': 'Управление отзывами',
        'admin-add-dish': 'Добавить новый товар',
        'admin-dish-name': 'Название <span class="text-red-500">*</span>',
        'admin-dish-description': 'Описание <span class="text-red-500">*</span>',
        'admin-dish-price': 'Цена <span class="text-red-500">*</span>',
        'admin-dish-category': 'Категория <span class="text-red-500">*</span>',
        'admin-dish-category-placeholder': 'Выберите категорию',
        'admin-dish-image': 'Изображение <span class="text-red-500">*</span>',
        'admin-add-dish-btn': 'Добавить товар',
        'admin-dishes-list': 'Список товаров',
        'admin-feedback-title': 'Управление отзывами',
        'admin-user-filter': 'Фильтр по пользователю',
        'admin-user-filter-placeholder': 'Все пользователи',
        'about-title': 'О нас - Yellow Kitchen',
        'about-story-title': 'Наша История',
        'about-story-text': 'Yellow Kitchen начала свой путь в 2010 году как небольшая семейная пекарня. С тех пор мы выросли в одну из самых известных кондитерских в городе, сохраняя при этом тепло и уют домашней выпечки.',
        'about-values-title': 'Наши Ценности',
        'about-values-text': 'Мы верим в качество, традиции и инновации. Каждый наш продукт создается с любовью и заботой, используя только лучшие ингредиенты и проверенные временем рецепты.',
        'about-future-title': 'Наше Будущее',
        'about-future-text': 'Мы продолжаем развиваться и радовать наших клиентов новыми вкусами и идеями. Наша цель - стать лучшей кондитерской в городе, сохраняя при этом душевность и качество домашней выпечки.'
    }
};

// Функция для получения текущего языка
function getCurrentLang() {
    return localStorage.getItem('language') || 'en';
}

// Функция для установки языка
function setLang(lang) {
    localStorage.setItem('language', lang);
    getTranslate(lang);
}

// Функция для перевода страницы
function getTranslate(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.dataset.i18n;
        if (i18Obj[lang] && i18Obj[lang][key]) {
            element.textContent = i18Obj[lang][key];
        }
    });

    // Обработка placeholder атрибутов
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.dataset.i18nPlaceholder;
        if (i18Obj[lang] && i18Obj[lang][key]) {
            element.placeholder = i18Obj[lang][key];
        }
    });
}

// Функция для инициализации переключателя языков
function initLanguageSwitcher() {
    const langSwitcher = document.querySelector('.language-switcher');
    if (langSwitcher) {
        const currentLang = getCurrentLang();
        langSwitcher.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="text-[#d4d7e5]">${currentLang === 'en' ? 'English' : 'Русский'}</span>
                <img src="images/down.svg" alt="Dropdown" class="w-6 h-6 pl-1 -mt-0.5">
            </div>
            <div class="language-dropdown hidden absolute top-full left-0 bg-white shadow-lg rounded-md mt-1">
                <button onclick="setLang('en')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">English</button>
                <button onclick="setLang('ru')" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Русский</button>
            </div>
        `;

        // Обработчик клика для показа/скрытия выпадающего списка
        langSwitcher.addEventListener('click', (e) => {
            const dropdown = langSwitcher.querySelector('.language-dropdown');
            dropdown.classList.toggle('hidden');
        });

        // Закрытие выпадающего списка при клике вне него
        document.addEventListener('click', (e) => {
            if (!langSwitcher.contains(e.target)) {
                const dropdown = langSwitcher.querySelector('.language-dropdown');
                if (dropdown) {
                    dropdown.classList.add('hidden');
                }
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = getCurrentLang();
    getTranslate(currentLang);
    initLanguageSwitcher();
}); 