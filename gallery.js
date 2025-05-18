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

// Добавляем стили для parallax эффекта
const parallaxStyles = `
    .history-section {
        perspective: 1000px;
    }

    .parallax-layer {
        transition: transform 0.1s ease-out;
        will-change: transform;
    }

    .floating-element {
        transition: transform 0.1s ease-out;
        will-change: transform;
    }

    .floating-elements {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .bg-layer {
        background-size: cover;
        background-position: center;
        z-index: 1;
        overflow: hidden;
    }

    .bg-images {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10%;
    }

    .bg-image {
        width: 30%;
        height: 100%;
        object-fit: cover;
        opacity: 0.7;
        filter: blur(2px);
        transition: transform 0.1s ease-out;
    }

    .text-blocks {
        position: relative;
        z-index: 2;
    }

    .text-block {
        position: sticky;
        top: 0;
        height: 100vh;
        display: flex;
        align-items: center;
        transition: opacity 0.5s ease-out;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }

    .text-block::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1;
    }

    .text-block > div {
        width: 100%;
        position: relative;
        z-index: 2;
    }

    .first-block {
        z-index: 3;
    }

    .second-block {
        z-index: 2;
    }

    .third-block {
        z-index: 1;
    }

    .front-layer {
        z-index: 4;
    }
`;

// Добавляем стили parallax на страницу
const parallaxStyleSheet = document.createElement("style");
parallaxStyleSheet.textContent = parallaxStyles;
document.head.appendChild(parallaxStyleSheet); 