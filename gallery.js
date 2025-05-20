// Стили для галереи
const galleryStyles = `
    .gallery-thumb.active {
        border: 2px solid #FFD700;
    }

    .gallery-thumbs-container {
        scrollbar-width: thin;
        scrollbar-color: #FFD700 #000;
    }

    .gallery-thumbs-container::-webkit-scrollbar {
        height: 8px;
    }

    .gallery-thumbs-container::-webkit-scrollbar-track {
        background: #000;
        border-radius: 4px;
    }

    .gallery-thumbs-container::-webkit-scrollbar-thumb {
        background-color: #FFD700;
        border-radius: 4px;
    }

    .gallery-main-content, .gallery-main-content video {
        width: 100%;
        height: 100%;
        background: #000;
    }
`;


// Добавляем стили на страницу
const styleSheet = document.createElement("style");
styleSheet.textContent = galleryStyles;
document.head.appendChild(styleSheet);

// Конфигурация
const UNSPLASH_API_KEY = 'HuABN90hSczCgLfA1iVfLIUq3OcUdhG9lBnFDPeXyfk';
const UNSPLASH_API_URL = 'https://api.unsplash.com';
const PHOTOS_PER_PAGE = 20;

// Элементы DOM
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const gallery = document.getElementById('gallery');
const noResults = document.getElementById('noResults');
const loading = document.getElementById('loading');
const filterBtns = document.querySelectorAll('.filter-btn');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalAuthor = document.getElementById('modalAuthor');
const modalDescription = document.getElementById('modalDescription');
const modalDownload = document.getElementById('modalDownload');
const modalDate = document.getElementById('modalDate');
const closeModal = document.getElementById('closeModal');

// Состояние приложения
let currentPage = 1;
let currentQuery = '';
let currentFilter = 'all';
let isLoading = false;

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Фокус на поле поиска при загрузке
    searchInput.focus();
    
    // Загрузка начальных изображений
    loadImages();
    
    // Обработчики событий
    setupEventListeners();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Поиск по Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentQuery = searchInput.value.trim();
            currentPage = 1;
            loadImages();
        }
    });

    // Очистка поиска
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        currentQuery = '';
        currentPage = 1;
        loadImages();
    });

    // Показ/скрытие кнопки очистки
    searchInput.addEventListener('input', () => {
        clearSearchBtn.classList.toggle('hidden', !searchInput.value);
    });

    // Фильтры
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Удаляем класс active у всех кнопок
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('bg-yellow-500');
                b.classList.remove('text-white');
                b.classList.add('bg-gray-200');
                b.classList.add('dark:bg-gray-700');
                b.classList.add('text-gray-700');
                b.classList.add('dark:text-gray-200');
            });
            
            // Добавляем класс active и стили для активной кнопки
            btn.classList.add('active');
            btn.classList.remove('bg-gray-200');
            btn.classList.remove('dark:bg-gray-700');
            btn.classList.remove('text-gray-700');
            btn.classList.remove('dark:text-gray-200');
            btn.classList.add('bg-yellow-500');
            btn.classList.add('text-white');
            
            currentFilter = btn.dataset.filter;
            currentPage = 1;
            loadImages();
        });
    });

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        imageModal.classList.add('hidden');
    });

    // Закрытие модального окна по клику вне изображения
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.add('hidden');
        }
    });

    // Бесконечная прокрутка
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
            loadMoreImages();
        }
    });
}

// Загрузка изображений
async function loadImages() {
    if (isLoading) return;
    isLoading = true;
    
    showLoading();
    hideNoResults();
    
    try {
        let query = currentQuery;
        
        // Применяем фильтр, если нет поискового запроса
        if (!query) {
            switch (currentFilter) {
                case 'nature':
                    query = 'nature landscape';
                    break;
                case 'architecture':
                    query = 'architecture building';
                    break;
                case 'food':
                    query = 'food cuisine';
                    break;
                default:
                    query = 'nature'; // По умолчанию показываем природу
            }
        }

        const response = await fetch(
            `${UNSPLASH_API_URL}/search/photos?query=${query}&page=${currentPage}&per_page=${PHOTOS_PER_PAGE}&orientation=landscape`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
                }
            }
        );

        if (!response.ok) throw new Error('Failed to fetch images');
        
        const data = await response.json();
        
        if (currentPage === 1) {
            gallery.innerHTML = '';
        }

        if (data.results.length === 0) {
            showNoResults();
        } else {
            renderImages(data.results);
        }
    } catch (error) {
        console.error('Error loading images:', error);
        showNotification('Ошибка при загрузке изображений', 'error');
    } finally {
        hideLoading();
        isLoading = false;
    }
}

// Загрузка дополнительных изображений
function loadMoreImages() {
    if (!isLoading && !noResults.classList.contains('hidden')) {
        currentPage++;
        loadImages();
    }
}

// Отрисовка изображений
function renderImages(images) {
    images.forEach(image => {
        const card = createImageCard(image);
        gallery.appendChild(card);
    });
}

// Создание карточки изображения
function createImageCard(image) {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer';
    
    card.innerHTML = `
        <div class="relative aspect-w-16 aspect-h-9">
            <img src="${image.urls.regular}" 
                 alt="${image.alt_description || 'Unsplash image'}" 
                 class="w-full h-full object-cover"
                 loading="lazy">
        </div>
        <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                ${image.description || 'Без названия'}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
                Фото: ${image.user.name}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
                ${new Date(image.created_at).toLocaleDateString()}
            </p>
        </div>
    `;

    card.addEventListener('click', () => showImageModal(image));
    
    return card;
}

// Показ модального окна с изображением
function showImageModal(image) {
    modalImage.src = image.urls.regular;
    modalImage.alt = image.alt_description || 'Unsplash image';
    modalTitle.textContent = image.description || 'Без названия';
    modalAuthor.textContent = `Фото: ${image.user.name}`;
    modalDescription.textContent = image.alt_description || '';
    modalDownload.href = image.links.download;
    modalDate.textContent = new Date(image.created_at).toLocaleDateString();
    
    imageModal.classList.remove('hidden');
}

// Вспомогательные функции
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showNoResults() {
    noResults.classList.remove('hidden');
}

function hideNoResults() {
    noResults.classList.add('hidden');
}

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0 z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
    });
    
    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
} 