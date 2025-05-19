class ParallaxEffect {
    constructor() {
        this.sections = document.querySelectorAll('.parallax-section');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.setupIntersectionObserver();
        this.handleScroll();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const content = entry.target.querySelector('.content-inner');
                if (entry.isIntersecting) {
                    content.classList.add('visible');
                }
            });
        }, {
            threshold: 0.5
        });

        this.sections.forEach(section => observer.observe(section));
    }

    handleScroll() {
        requestAnimationFrame(() => {
            const viewportHeight = window.innerHeight;
            
            this.sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const bg = section.querySelector('.parallax-bg');
                
                // Рассчитываем прогресс прокрутки для каждой секции
                const progress = Math.min(
                    Math.max(
                        (viewportHeight - rect.top) / viewportHeight,
                        0
                    ),
                    1
                );

                // Применяем параллакс-эффект к фону
                if (bg) {
                    const translateY = progress * 100; // Увеличиваем величину сдвига для более заметного эффекта
                    bg.style.transform = `translateY(${translateY}px)`;
                }
            });
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
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParallaxEffect();
    new SmoothScroll();
    new BackToTop();
}); 