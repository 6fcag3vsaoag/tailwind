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

// Функция для генерации случайных звуков
function playRandomGeneratedSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const type = Math.floor(Math.random() * 4);

    if (type === 0) {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 1000 + Math.random() * 2000;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } else if (type === 1) {
        const bufferSize = 4096;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.connect(ctx.destination);
        noise.start();
        noise.stop(ctx.currentTime + 0.2);
    } else if (type === 2) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 400 + Math.random() * 2000;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } else {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 80 + Math.random() * 120;
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }
}

// Добавляем стили на страницу
const styleSheet = document.createElement("style");
styleSheet.textContent = galleryStyles;
document.head.appendChild(styleSheet);


class YellowKitchenGallery {
    constructor() {
        this.galleryFiles = [
            '1.jpg', '2.jpg', '3.jpg', '1244429.jpg',
            '2024-year-digital-art-4k-wallpaper-uhdpaper.com-901@0@i.jpg',
            'anime-night-stars-sky-clouds-scenery-digital-art-4k-wallpaper-uhdpaper.com-772@0@i.jpg',
            'car-night-street-digital-art-4k-wallpaper-uhdpaper.com-16@0@j.jpg',
            'car-road-forest-sunset-mountain-scenery-4k-wallpaper-uhdpaper.com-878@1@m.jpg',
            'car-street-night-city-digital-art-4k-wallpaper-uhdpaper.com-914@0@i.jpg',
            'delorean-car-time-machine-neon-lights-digital-art-4k-wallpaper-uhdpaper.com-17@0@j.jpg',
            'ferrari-car-road-hollywood-night-city-scenery-digital-art-4k-wallpaper-uhdpaper.com-202@1@n.jpg',
            'lighthouse-sunset-scenery-digital-art-4k-wallpaper-uhdpaper.com-326@1@m.jpg',
            'muscle-car-ice-road-red-moon-digital-art-4k-wallpaper-uhdpaper.com-18@0@j.jpg',
            'muscle-car-night-road-digital-art-4k-wallpaper-uhdpaper.com-25@0@j.jpg',
            'sci-fi-digital-art-uhdpaper.com-8K-4.956.jpg',
            'soldier-gas-mask-flower-digital-art-4k-wallpaper-uhdpaper.com-13@0@j.jpg',
            'sports-car-red-smoke-digital-art-4k-wallpaper-uhdpaper.com-28@0@j.jpg',
            'sports-car-road-digital-art-4k-wallpaper-uhdpaper.com-15@0@j.jpg',
            'sunset-road-car-forest-scenery-digital-art-4k-wallpaper-uhdpaper.com-881@1@m.jpg',
            'wallpapersden.com_cityscape-8k-cyber-city-digital-art_7680x4320.jpg',
            'SampleVideo_1280x720_5mb.mp4'
        ];

        this.currentIndex = 0;
        this.mainContent = document.querySelector('.main-content');
        this.thumbnailsContainer = document.querySelector('.thumbnails');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.prevThumbBtn = document.querySelector('.prev-thumb-btn');
        this.nextThumbBtn = document.querySelector('.next-thumb-btn');

        this.init();
    }

    init() {
        this.createThumbnails();
        this.setupEventListeners();
        this.showItem(0);
    }

    createThumbnails() {
        if (!this.thumbnailsContainer) return;

        this.galleryFiles.forEach((file, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            thumbnail.dataset.index = index;

            if (file.endsWith('.mp4')) {
                thumbnail.innerHTML = `
                    <div class="relative w-full h-full">
                        <video class="w-full h-full object-cover" muted preload="metadata">
                            <source src="gallery/${file}" type="video/mp4">
                        </video>
                        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                `;

                // Добавляем обработчик для загрузки превью видео
                const video = thumbnail.querySelector('video');
                if (video) {
                    video.addEventListener('loadeddata', () => {
                        // Устанавливаем время на 1 секунду для превью
                        video.currentTime = 1;
                    });
                }
            } else {
                thumbnail.innerHTML = `
                    <img src="gallery/${file}" alt="Миниатюра ${index + 1}" class="w-full h-full object-cover">
                `;
            }

            thumbnail.addEventListener('click', () => {
                this.showItem(index);
                this.playRandomGeneratedSound();
            });

            this.thumbnailsContainer.appendChild(thumbnail);
        });
    }

    setupEventListeners() {
        // Основная навигация
        this.prevBtn?.addEventListener('click', () => {
            this.showPrev();
            this.playRandomGeneratedSound();
        });

        this.nextBtn?.addEventListener('click', () => {
            this.showNext();
            this.playRandomGeneratedSound();
        });

        // Навигация по миниатюрам
        this.prevThumbBtn?.addEventListener('click', () => {
            this.scrollThumbnails('prev');
        });

        this.nextThumbBtn?.addEventListener('click', () => {
            this.scrollThumbnails('next');
        });

        // Обработка клавиш
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.showPrev();
                this.playRandomGeneratedSound();
            } else if (e.key === 'ArrowRight') {
                this.showNext();
                this.playRandomGeneratedSound();
            }
        });
    }

    showItem(index) {
        if (index < 0 || index >= this.galleryFiles.length) return;

        this.currentIndex = index;
        const file = this.galleryFiles[index];

        // Обновляем основное изображение/видео
        if (this.mainContent) {
            if (file.endsWith('.mp4')) {
                this.mainContent.innerHTML = `
                    <video class="w-full h-full" controls>
                        <source src="gallery/${file}" type="video/mp4">
                    </video>
                `;
            } else {
                this.mainContent.innerHTML = `
                    <img src="gallery/${file}" alt="Изображение ${index + 1}" class="w-full h-full object-contain">
                `;
            }
        }

        // Обновляем активную миниатюру
        const thumbnails = this.thumbnailsContainer?.querySelectorAll('.thumbnail');
        thumbnails?.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Прокручиваем к активной миниатюре
        this.scrollToActiveThumbnail();
    }

    showPrev() {
        const newIndex = (this.currentIndex - 1 + this.galleryFiles.length) % this.galleryFiles.length;
        this.showItem(newIndex);
    }

    showNext() {
        const newIndex = (this.currentIndex + 1) % this.galleryFiles.length;
        this.showItem(newIndex);
    }

    scrollThumbnails(direction) {
        if (!this.thumbnailsContainer) return;

        const containerWidth = this.thumbnailsContainer.parentElement.offsetWidth;
        const thumbnailWidth = 120; // Ширина миниатюры + отступ
        const visibleThumbnails = Math.floor(containerWidth / thumbnailWidth);
        const scrollAmount = visibleThumbnails * thumbnailWidth;

        const currentScroll = parseInt(this.thumbnailsContainer.style.transform.replace('translateX(', '').replace('px)', '') || 0);
        const maxScroll = -(this.galleryFiles.length * thumbnailWidth - containerWidth);

        let newScroll;
        if (direction === 'prev') {
            newScroll = Math.min(0, currentScroll + scrollAmount);
        } else {
            newScroll = Math.max(maxScroll, currentScroll - scrollAmount);
        }

        this.thumbnailsContainer.style.transform = `translateX(${newScroll}px)`;
    }

    scrollToActiveThumbnail() {
        if (!this.thumbnailsContainer) return;

        const thumbnailWidth = 120; // Ширина миниатюры + отступ
        const containerWidth = this.thumbnailsContainer.parentElement.offsetWidth;
        const visibleThumbnails = Math.floor(containerWidth / thumbnailWidth);

        const currentScroll = parseInt(this.thumbnailsContainer.style.transform.replace('translateX(', '').replace('px)', '') || 0);
        const targetScroll = -(this.currentIndex * thumbnailWidth);

        // Проверяем, видна ли активная миниатюра
        const isVisible = targetScroll >= currentScroll && 
                         targetScroll <= currentScroll - (visibleThumbnails * thumbnailWidth);

        if (!isVisible) {
            this.thumbnailsContainer.style.transform = `translateX(${targetScroll}px)`;
        }
    }

    playRandomGeneratedSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440 + Math.random() * 440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Инициализация галереи при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new YellowKitchenGallery();
}); 