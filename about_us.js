class Gallery {
    constructor() {
        this.currentIndex = 0;
        this.thumbs = document.querySelectorAll('.gallery-thumb');
        this.mainContent = document.querySelector('.gallery-main-content');
        this.prevButton = document.querySelector('.gallery-prev');
        this.nextButton = document.querySelector('.gallery-next');
        
        this.init();
    }

    init() {
        // Добавляем обработчики для превью
        this.thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                if (typeof window.playRandomGeneratedSound === 'function') window.playRandomGeneratedSound();
                this.showItem(index);
            });
        });

        // Добавляем обработчики для кнопок навигации
        this.prevButton.addEventListener('click', () => this.showPrev());
        this.nextButton.addEventListener('click', () => this.showNext());

        // Показываем первый элемент
        this.showItem(0);
    }

    showItem(index) {
        // Останавливаем текущее видео, если оно есть
        const currentVideo = this.mainContent.querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
            currentVideo.currentTime = 0;
        }

        // Обновляем активный класс у превью
        this.thumbs.forEach(thumb => thumb.classList.remove('active'));
        this.thumbs[index].classList.add('active');

        // Получаем данные о текущем элементе
        const thumb = this.thumbs[index];
        const type = thumb.dataset.type;
        const src = thumb.dataset.src;

        // Очищаем основной контейнер
        this.mainContent.innerHTML = '';

        // Создаем новый элемент
        if (type === 'video') {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.className = 'w-full h-full object-contain bg-black';
            video.muted = true;
            video.autoplay = true;
            video.playsInline = true;
            video.style.display = 'block';

            this.mainContent.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = thumb.querySelector('img') ? thumb.querySelector('img').alt : '';
            img.className = 'w-full h-full object-contain';
            this.mainContent.appendChild(img);
        }

        this.currentIndex = index;
    }

    showPrev() {
        if (typeof window.playRandomGeneratedSound === 'function') window.playRandomGeneratedSound();
        const newIndex = (this.currentIndex - 1 + this.thumbs.length) % this.thumbs.length;
        this.showItem(newIndex);
    }

    showNext() {
        if (typeof window.playRandomGeneratedSound === 'function') window.playRandomGeneratedSound();
        const newIndex = (this.currentIndex + 1) % this.thumbs.length;
        this.showItem(newIndex);
    }
}

// Массив файлов галереи (автоматически сгенерирован)
const galleryFiles = [
    'gallery/SampleVideo_1280x720_5mb.mp4',
    'gallery/car-street-night-city-digital-art-4k-wallpaper-uhdpaper.com-914@0@i.jpg',
    'gallery/lighthouse-sunset-scenery-digital-art-4k-wallpaper-uhdpaper.com-326@1@m.jpg',
    'gallery/wallpapersden.com_cityscape-8k-cyber-city-digital-art_7680x4320.jpg',
    'gallery/muscle-car-night-road-digital-art-4k-wallpaper-uhdpaper.com-25@0@j.jpg',
    'gallery/2024-year-digital-art-4k-wallpaper-uhdpaper.com-901@0@i.jpg',
    'gallery/anime-night-stars-sky-clouds-scenery-digital-art-4k-wallpaper-uhdpaper.com-772@0@i.jpg',
    'gallery/ferrari-car-road-hollywood-night-city-scenery-digital-art-4k-wallpaper-uhdpaper.com-202@1@n.jpg',
    'gallery/car-night-street-digital-art-4k-wallpaper-uhdpaper.com-16@0@j.jpg',
    'gallery/sunset-road-car-forest-scenery-digital-art-4k-wallpaper-uhdpaper.com-881@1@m.jpg',
    'gallery/car-road-forest-sunset-mountain-scenery-4k-wallpaper-uhdpaper.com-878@1@m.jpg',
    'gallery/alone-night-city-scenery-digital-art-4k-wallpaper-uhdpaper.com-851@1@m.jpg',
    'gallery/sports-car-red-smoke-digital-art-4k-wallpaper-uhdpaper.com-28@0@j.jpg',
    'gallery/sports-car-road-digital-art-4k-wallpaper-uhdpaper.com-15@0@j.jpg',
    'gallery/delorean-car-time-machine-neon-lights-digital-art-4k-wallpaper-uhdpaper.com-17@0@j.jpg',
    'gallery/soldier-gas-mask-flower-digital-art-4k-wallpaper-uhdpaper.com-13@0@j.jpg',
    'gallery/muscle-car-ice-road-red-moon-digital-art-4k-wallpaper-uhdpaper.com-18@0@j.jpg',
    'gallery/sci-fi-digital-art-uhdpaper.com-8K-4.956.jpg',
    'gallery/1244429.jpg'
];

// Parallax эффект
class ParallaxEffect {
    constructor() {
        this.historySection = document.querySelector('.history-section');
        this.textBlocks = document.querySelectorAll('.text-block');
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        this.handleScroll(); // Инициализация начального положения
    }

    handleScroll() {
        const scrollY = window.scrollY;
        const sectionTop = this.historySection.offsetTop;
        const sectionHeight = this.historySection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Проверяем, находится ли секция в области видимости
        if (scrollY + viewportHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
            // Управляем наложением текстовых блоков
            this.textBlocks.forEach((block, index) => {
                const blockTop = block.offsetTop;
                const blockHeight = block.offsetHeight;
                const scrollProgress = (scrollY - blockTop + viewportHeight) / (blockHeight + viewportHeight);
                
                if (scrollProgress > 0 && scrollProgress < 1) {
                    // Плавно меняем прозрачность блоков при наложении
                    const opacity = Math.min(1, Math.max(0, 1 - scrollProgress));
                    block.style.opacity = opacity;
                } else if (scrollProgress >= 1) {
                    block.style.opacity = 0;
                } else {
                    block.style.opacity = 1;
                }
            });
        }
    }

    handleResize() {
        // Сбрасываем прозрачность при изменении размера окна
        this.textBlocks.forEach(block => {
            block.style.opacity = '1';
        });
        this.handleScroll(); // Пересчитываем позиции
    }
}

// Инициализация галереи после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
    new ParallaxEffect();
}); 