// Функция для получения списка файлов из папки галереи
async function getGalleryFiles() {
    // Временный массив для демонстрации с тестовыми изображениями
    return [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=2',
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4',
        'https://picsum.photos/800/600?random=5'
    ];
}

// Функция для определения типа файла
function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    return 'unknown';
}

// Функция для создания элемента галереи
function createGalleryItem(file) {
    const type = getFileType(file);
    const container = document.createElement('div');
    container.className = 'relative w-full h-[300px] overflow-hidden rounded-lg shadow-lg group cursor-pointer';
    
    if (type === 'video') {
        // Для видео создаем превью с кнопкой воспроизведения
        container.innerHTML = `
            <img src="${file.replace(/\.[^/.]+$/, '.jpg')}" alt="Video thumbnail" class="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105">
            <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button class="play-video-btn bg-yellow-500 text-white p-4 rounded-full transform hover:scale-110 transition-transform duration-300">
                    <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <img src="${file}" alt="Gallery image" class="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105">
        `;
    }
    
    return container;
}

// Функция для инициализации галереи
async function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;
    
    const files = await getGalleryFiles();
    
    // Создаем сетку для миниатюр
    const thumbnailsGrid = document.createElement('div');
    thumbnailsGrid.className = 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4';
    
    // Добавляем миниатюры
    files.forEach(file => {
        const thumbnail = createGalleryItem(file);
        thumbnailsGrid.appendChild(thumbnail);
        
        // Добавляем обработчик клика
        thumbnail.addEventListener('click', () => {
            const type = getFileType(file);
            if (type === 'video') {
                showVideo(file);
            } else {
                showImage(file);
            }
        });
    });
    
    galleryContainer.appendChild(thumbnailsGrid);
}

// Функция для отображения изображения
function showImage(file) {
    const mainContainer = document.querySelector('.main-image-container');
    if (!mainContainer) return;
    
    mainContainer.innerHTML = `
        <img id="mainImage" src="${file}" alt="Gallery Image" class="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105">
    `;
    
    // Воспроизводим соответствующий звук, если есть
    const audioFile = file.replace(/\.[^/.]+$/, '.mp3');
    playAudio(audioFile);
}

// Функция для отображения видео
function showVideo(file) {
    const mainContainer = document.querySelector('.main-image-container');
    if (!mainContainer) return;
    
    const videoHtml = `
        <video class="w-full h-full object-cover" controls>
            <source src="${file}" type="video/${file.split('.').pop()}">
            Ваш браузер не поддерживает видео.
        </video>
    `;
    mainContainer.innerHTML = videoHtml;
}

// Функция для воспроизведения звука
function playAudio(file) {
    if (audioPlayer) {
        audioPlayer.pause();
    }
    try {
        audioPlayer = new Audio(file);
        audioPlayer.volume = volumeSlider ? volumeSlider.value / 100 : 0.5;
        audioPlayer.play().catch(error => {
            console.log('Воспроизведение аудио недоступно:', error);
            // Продолжаем работу без звука
        });
    } catch (error) {
        console.log('Ошибка при создании аудио:', error);
        // Продолжаем работу без звука
    }
}

// Текущий индекс изображения
let currentImageIndex = 0;
let isPlaying = false;
let audioPlayer = null;
let playInterval;

// DOM элементы
let volumeSlider = null;
let playerStatus = null;
let prevBtn = null;
let nextBtn = null;
let playBtn = null;
let mainVideo = null;

// Функция для обновления статуса плеера
function updatePlayerStatus(playing) {
    isPlaying = playing;
    playerStatus.classList.remove('hidden');
    playerStatus.querySelector('.playing').style.display = playing ? 'block' : 'none';
    playerStatus.querySelector('.paused').style.display = playing ? 'none' : 'block';
    
    setTimeout(() => {
        playerStatus.classList.add('hidden');
    }, 2000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем элементы управления
    volumeSlider = document.getElementById('volumeSlider');
    playerStatus = document.getElementById('playerStatus');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    playBtn = document.getElementById('playBtn');
    mainVideo = document.getElementById('mainVideo');
    
    // Добавляем обработчики событий только если элементы существуют
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            if (audioPlayer) {
                audioPlayer.volume = volumeSlider.value / 100;
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateImage(currentImageIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateImage(currentImageIndex);
        });
    }
    
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                clearInterval(playInterval);
                if (audioPlayer) audioPlayer.pause();
                updatePlayerStatus(false);
                playBtn.textContent = 'Воспроизвести';
            } else {
                playInterval = setInterval(() => {
                    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                    updateImage(currentImageIndex);
                }, 3000);
                if (audioPlayer) audioPlayer.play();
                updatePlayerStatus(true);
                playBtn.textContent = 'Пауза';
            }
        });
    }
    
    // Инициализируем галерею
    initGallery();
    
    // Инициализируем parallax эффект
    const parallaxSection = document.getElementById('parallax');
    if (parallaxSection) {
        document.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const bgLayer = parallaxSection.querySelector('.bg-layer');
            const middleLayer = parallaxSection.querySelector('.middle-layer');
            const frontLayer = parallaxSection.querySelector('.front-layer');
            
            if (bgLayer && middleLayer && frontLayer) {
                bgLayer.style.transform = `translateY(${scrolled * 0.5}px)`;
                middleLayer.style.transform = `translateY(${scrolled * 0.3}px)`;
                frontLayer.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });
    }
    
    // Инициализируем плавную прокрутку
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Инициализируем анимацию появления элементов
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-4');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Анимация при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.bg-white.rounded-lg.shadow-lg');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Инициализация анимации
    const initAnimation = () => {
        const elements = document.querySelectorAll('.bg-white.rounded-lg.shadow-lg');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        });
    };

    // Обработчик скролла
    window.addEventListener('scroll', animateOnScroll);

    // Инициализация при загрузке страницы
    initAnimation();
    animateOnScroll();

    // Обработка кнопок доставки и самовывоза
    const deliveryButton = document.querySelector('a[href="#"]:first-of-type');
    const takeoutButton = document.querySelector('a[href="#"]:last-of-type');

    if (deliveryButton) {
        deliveryButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Здесь можно добавить логику для перехода на страницу доставки
            console.log('Delivery button clicked');
        });
    }

    if (takeoutButton) {
        takeoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Здесь можно добавить логику для перехода на страницу самовывоза
            console.log('Takeout button clicked');
        });
    }
}); 