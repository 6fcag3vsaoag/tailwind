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

// Конфигурация приложения
const CONFIG = {
    API_KEY: 'HuABN90hSczCgLfA1iVfLIUq3OcUdhG9lBnFDPeXyfk',
    API_URL: 'https://api.unsplash.com',
    PHOTOS_PER_PAGE: 20,
    FILTERS: {
        all: 'nature',
        nature: 'nature landscape',
        architecture: 'architecture building',
        food: 'food cuisine'
    }
};

// Состояние приложения
const state = {
    currentPage: 1,
    currentQuery: '',
    currentFilter: 'all',
    isLoading: false
};

// DOM элементы
const elements = {
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearch'),
    gallery: document.getElementById('gallery'),
    noResults: document.getElementById('noResults'),
    loading: document.getElementById('loading'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    imageModal: document.getElementById('imageModal'),
    modalImage: document.getElementById('modalImage'),
    modalTitle: document.getElementById('modalTitle'),
    modalAuthor: document.getElementById('modalAuthor'),
    modalDescription: document.getElementById('modalDescription'),
    modalDownload: document.getElementById('modalDownload'),
    modalDate: document.getElementById('modalDate'),
    closeModal: document.getElementById('closeModal')
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    elements.searchInput.focus();
    loadImages();
    setupEventListeners();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Поиск по Enter
    elements.searchInput.addEventListener('keypress', handleSearch);
    
    // Очистка поиска
    elements.clearSearchBtn.addEventListener('click', handleClearSearch);
    
    // Показ/скрытие кнопки очистки
    elements.searchInput.addEventListener('input', handleSearchInput);
    
    // Фильтры
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleFilterClick(btn));
    });
    
    // Закрытие модального окна
    elements.closeModal.addEventListener('click', () => {
        elements.imageModal.classList.add('hidden');
    });
    
    // Закрытие модального окна по клику вне изображения
    elements.imageModal.addEventListener('click', (e) => {
        if (e.target === elements.imageModal) {
            elements.imageModal.classList.add('hidden');
        }
    });
    
    // Бесконечная прокрутка
    window.addEventListener('scroll', handleScroll);
}

// Обработчики событий
function handleSearch(e) {
    if (e.key === 'Enter') {
        state.currentQuery = elements.searchInput.value.trim();
        state.currentPage = 1;
        loadImages();
    }
}

function handleClearSearch() {
    elements.searchInput.value = '';
    elements.clearSearchBtn.classList.add('hidden');
    state.currentQuery = '';
    state.currentPage = 1;
    loadImages();
}

function handleSearchInput() {
    elements.clearSearchBtn.classList.toggle('hidden', !elements.searchInput.value);
}

function handleFilterClick(btn) {
    // Сброс стилей всех кнопок
    elements.filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-yellow-500', 'text-white');
        b.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-200');
    });
    
    // Установка стилей активной кнопки
    btn.classList.add('active', 'bg-yellow-500', 'text-white');
    btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-200');
    
    state.currentFilter = btn.dataset.filter;
    state.currentPage = 1;
    loadImages();
}

function handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
        loadMoreImages();
    }
}

// Загрузка изображений
async function loadImages() {
    if (state.isLoading) return;
    state.isLoading = true;
    
    showLoading();
    hideNoResults();
    
    try {
        const query = state.currentQuery || CONFIG.FILTERS[state.currentFilter];
        
        const response = await fetch(
            `${CONFIG.API_URL}/search/photos?query=${query}&page=${state.currentPage}&per_page=${CONFIG.PHOTOS_PER_PAGE}&orientation=landscape`,
            {
                headers: {
                    'Authorization': `Client-ID ${CONFIG.API_KEY}`
                }
            }
        );

        if (!response.ok) throw new Error('Failed to fetch images');
        
        const data = await response.json();
        
        if (state.currentPage === 1) {
            elements.gallery.innerHTML = '';
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
        state.isLoading = false;
    }
}

// Загрузка дополнительных изображений
function loadMoreImages() {
    if (!state.isLoading && !elements.noResults.classList.contains('hidden')) {
        state.currentPage++;
        loadImages();
    }
}

// Отрисовка изображений
function renderImages(images) {
    images.forEach(image => {
        const card = createImageCard(image);
        elements.gallery.appendChild(card);
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
    elements.modalImage.src = image.urls.regular;
    elements.modalImage.alt = image.alt_description || 'Unsplash image';
    elements.modalTitle.textContent = image.description || 'Без названия';
    elements.modalAuthor.textContent = `Фото: ${image.user.name}`;
    elements.modalDescription.textContent = image.alt_description || '';
    elements.modalDownload.href = image.links.download;
    elements.modalDate.textContent = new Date(image.created_at).toLocaleDateString();
    
    elements.imageModal.classList.remove('hidden');
}

// Вспомогательные функции
function showLoading() {
    elements.loading.classList.remove('hidden');
}

function hideLoading() {
    elements.loading.classList.add('hidden');
}

function showNoResults() {
    elements.noResults.classList.remove('hidden');
}

function hideNoResults() {
    elements.noResults.classList.add('hidden');
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