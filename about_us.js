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

class YellowKitchenGallery {
    constructor(container) {
        this.container = container;
        this.currentIndex = 0;
        this.thumbs = container.querySelectorAll('.gallery-thumb');
        this.mainContent = container.querySelector('.gallery-main-content');
        this.prevButton = container.querySelector('.gallery-prev');
        this.nextButton = container.querySelector('.gallery-next');
        
        this.init();
    }

    init() {
        this.thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                if (typeof window.playRandomGeneratedSound === 'function') window.playRandomGeneratedSound();
                this.showItem(index);
            });
        });

        this.prevButton.addEventListener('click', () => this.showPrev());
        this.nextButton.addEventListener('click', () => this.showNext());

        this.showItem(0);
    }

    showItem(index) {
        const currentVideo = this.mainContent.querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
            currentVideo.currentTime = 0;
        }

        this.thumbs.forEach(thumb => thumb.classList.remove('active'));
        this.thumbs[index].classList.add('active');

        const thumb = this.thumbs[index];
        const type = thumb.dataset.type;
        const src = thumb.dataset.src;

        this.mainContent.innerHTML = '';

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

class ParallaxEffect {
    constructor() {
        this.stages = document.querySelectorAll('.parallax-stage');
        this.isScrolling = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        this.setupIntersectionObserver();
        this.handleScroll();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const content = entry.target.querySelector('.content-inner');
                if (entry.isIntersecting) {
                    content.classList.add('visible');
                } else {
                    content.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -20% 0px'
        });

        this.stages.forEach(stage => observer.observe(stage));
    }

    handleScroll() {
        if (this.isScrolling) return;
        this.isScrolling = true;

        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            this.stages.forEach(stage => {
                const stageTop = stage.offsetTop;
                const farBg = stage.querySelector('.far-bg');
                const midBg = stage.querySelector('.mid-bg');
                const fg = stage.querySelector('.parallax-fg');
                const content = stage.querySelector('.content');

                const scrollProgress = Math.min((scrollY - stageTop + viewportHeight / 2) / viewportHeight, 1);

                if (farBg) {
                    farBg.style.transform = `translateY(${scrollProgress * 150}px) translateZ(-100px) scale(1.1)`;
                }
                if (midBg) {
                    midBg.style.transform = `translateY(${scrollProgress * 400}px) translateX(${-scrollProgress * 100}px) translateZ(-50px) scale(1.2)`;
                }
                if (fg) {
                    fg.style.transform = `translateY(${scrollProgress * 600}px) translateX(${scrollProgress * 200}px) translateZ(50px) rotate(${scrollProgress * 8}deg)`;
                }
                if (content && !stage.classList.contains('stage-3')) {
                    content.style.transform = `translateY(${scrollProgress * -100}px) translateZ(20px) rotateX(${scrollProgress * 5}deg)`;
                }
            });

            this.isScrolling = false;
        });
    }

    handleResize() {
        this.stages.forEach(stage => {
            const content = stage.querySelector('.content-inner');
            const farBg = stage.querySelector('.far-bg');
            const midBg = stage.querySelector('.mid-bg');
            const fg = stage.querySelector('.parallax-fg');
            const contentContainer = stage.querySelector('.content');
            content.classList.remove('visible');
            if (farBg) farBg.style.transform = 'translateY(0) translateZ(0) scale(1)';
            if (midBg) midBg.style.transform = 'translateY(0) translateX(0) translateZ(0) scale(1)';
            if (fg) fg.style.transform = 'translateY(0) translateX(0) translateZ(0) rotate(0deg)';
            if (contentContainer && !stage.classList.contains('stage-3')) {
                contentContainer.style.transform = 'translateY(0) translateZ(0) rotateX(0deg)';
            }
        });
    }
}

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('.smooth-scroll');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    if (typeof window.playRandomGeneratedSound === 'function') {
                        window.playRandomGeneratedSound();
                    }
                }
            });
        });
    }
}

class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            if (typeof window.playRandomGeneratedSound === 'function') {
                window.playRandomGeneratedSound();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.stage-3 .gallery-container');
    if (galleryContainer) {
        new YellowKitchenGallery(galleryContainer);
    }
    new ParallaxEffect();
    new SmoothScroll();
    new BackToTop();
});