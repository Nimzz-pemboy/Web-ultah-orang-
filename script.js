const entryScreen = document.getElementById('entryScreen');
const startBtn = document.getElementById('startJourney');
const mainContent = document.getElementById('mainContent');
const bgMusic = document.getElementById('bgMusic');
const mainPlayBtn = document.getElementById('mainPlayBtn');
const mainPlayIcon = mainPlayBtn.querySelector('i');
const albumArt = document.getElementById('albumArtImg');

let isPlaying = false;

function setPlayingState(playState) {
    isPlaying = playState;
    mainPlayIcon.className = playState ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    albumArt.classList.toggle('spinning', playState);
    if (playState) {
        document.querySelector('.art-shadow').style.backgroundImage = `url(${albumArt.src})`;
    }
}

startBtn.addEventListener('click', (e) => {
    entryScreen.classList.add('fade-out');
    burstConfetti(e.clientX, e.clientY, 26);

    bgMusic.play().then(() => {
        setPlayingState(true);
    }).catch(() => {});

    setTimeout(() => {
        mainContent.classList.remove('hidden');
        initObserver();
    }, 1500);
});

const envelopeContainer = document.getElementById('envelopeContainer');
const envelopeHint = document.querySelector('.envelope-hint');
let envelopeOpened = false;

envelopeContainer.addEventListener('click', (e) => {
    if (!envelopeOpened) {
        envelopeContainer.classList.add('open');
        envelopeHint.style.opacity = '0';
        envelopeOpened = true;
        burstConfetti(e.clientX, e.clientY, 18);
    }
});

const fabBtn = document.getElementById('fabBtn');
const fabMenu = document.getElementById('fabMenu');
const overlay = document.getElementById('overlay');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const progressTrack = document.getElementById('progressTrack');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

function closeMenu() {
    fabMenu.classList.remove('active');
    overlay.classList.remove('active');
    fabBtn.classList.remove('active-state');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

function toggleFab() {
    const isActive = fabMenu.classList.contains('active');
    if (isActive) {
        closeMenu();
    } else {
        overlay.style.display = 'block';
        setTimeout(() => {
            fabMenu.classList.add('active');
            overlay.classList.add('active');
            fabBtn.classList.add('active-state');
        }, 10);
    }
}

fabBtn.addEventListener('click', toggleFab);
closePlayerBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

function togglePlay() {
    if (isPlaying) {
        bgMusic.pause();
        setPlayingState(false);
    } else {
        bgMusic.play();
        setPlayingState(true);
    }
}

mainPlayBtn.addEventListener('click', togglePlay);

bgMusic.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(bgMusic.duration);
});

bgMusic.addEventListener('timeupdate', () => {
    const current = bgMusic.currentTime;
    const duration = bgMusic.duration;

    if (duration) {
        const percent = (current / duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(current);
        if (totalTimeEl.textContent === "0:00") {
            totalTimeEl.textContent = formatTime(duration);
        }
    }
});

progressTrack.addEventListener('click', (e) => {
    const rect = progressTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = bgMusic.duration;
    if (duration) {
        bgMusic.currentTime = (clickX / width) * duration;
    }
});

bgMusic.addEventListener('ended', () => {
    setPlayingState(false);
    progressFill.style.width = '0%';
    currentTimeEl.textContent = "0:00";
});

document.getElementById('scrollToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function initObserver() {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

const dustCanvas = document.getElementById('dustCanvas');
const dustCtx = dustCanvas.getContext('2d');
let dustMotes = [];
let dustW = 0;
let dustH = 0;

function resizeDustCanvas() {
    dustW = window.innerWidth;
    dustH = window.innerHeight;
    dustCanvas.width = dustW * window.devicePixelRatio;
    dustCanvas.height = dustH * window.devicePixelRatio;
    dustCanvas.style.width = `${dustW}px`;
    dustCanvas.style.height = `${dustH}px`;
    dustCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function createDustMotes(count) {
    const motes = [];
    for (let i = 0; i < count; i++) {
        motes.push({
            x: Math.random() * dustW,
            y: Math.random() * dustH,
            r: Math.random() * 2 + 0.6,
            speed: Math.random() * 0.35 + 0.08,
            drift: Math.random() * 0.6 - 0.3,
            alpha: Math.random() * 0.35 + 0.1,
            phase: Math.random() * Math.PI * 2
        });
    }
    return motes;
}

function animateDust(time) {
    dustCtx.clearRect(0, 0, dustW, dustH);
    dustCtx.fillStyle = '#b3a89a';

    dustMotes.forEach(mote => {
        mote.y -= mote.speed;
        mote.x += Math.sin(time / 3000 + mote.phase) * 0.15 + mote.drift * 0.02;

        if (mote.y < -10) {
            mote.y = dustH + 10;
            mote.x = Math.random() * dustW;
        }
        if (mote.x < -10) mote.x = dustW + 10;
        if (mote.x > dustW + 10) mote.x = -10;

        const flicker = (Math.sin(time / 900 + mote.phase) + 1) / 2;
        dustCtx.globalAlpha = mote.alpha * (0.5 + flicker * 0.5);
        dustCtx.beginPath();
        dustCtx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
        dustCtx.fill();
    });

    dustCtx.globalAlpha = 1;
    requestAnimationFrame(animateDust);
}

resizeDustCanvas();
dustMotes = createDustMotes(Math.round((dustW * dustH) / 26000));
requestAnimationFrame(animateDust);

window.addEventListener('resize', () => {
    resizeDustCanvas();
    dustMotes = createDustMotes(Math.round((dustW * dustH) / 26000));
});

const cursorGlow = document.getElementById('cursorGlow');
const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 2;
let targetX = glowX;
let targetY = glowY;

if (supportsFinePointer) {
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        cursorGlow.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('visible');
    });

    function animateGlow() {
        glowX += (targetX - glowX) * 0.12;
        glowY += (targetY - glowY) * 0.12;
        cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
        requestAnimationFrame(animateGlow);
    }
    requestAnimationFrame(animateGlow);
}

function burstConfetti(originX, originY, amount) {
    const shapes = ['fa-heart', 'fa-star'];
    const tints = ['#8b1e1e', '#c9a46b', '#242424', '#b98a8a'];
    const x = originX || window.innerWidth / 2;
    const y = originY || window.innerHeight / 2;

    for (let i = 0; i < amount; i++) {
        const piece = document.createElement('i');
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        piece.className = `fa-solid ${shape} confetti-piece`;

        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 220;
        const driftX = Math.cos(angle) * distance;
        const driftY = Math.abs(Math.sin(angle)) * distance + 120;

        piece.style.setProperty('--start-x', `${x}px`);
        piece.style.setProperty('--start-y', `${y}px`);
        piece.style.setProperty('--drift-x', `${driftX}px`);
        piece.style.setProperty('--drift-y', `${driftY}px`);
        piece.style.setProperty('--size', `${0.6 + Math.random() * 1.1}rem`);
        piece.style.setProperty('--tint', tints[Math.floor(Math.random() * tints.length)]);
        piece.style.setProperty('--duration', `${1.6 + Math.random() * 1.2}s`);
        piece.style.setProperty('--delay', `${Math.random() * 0.25}s`);
        piece.style.setProperty('--spin', `${(Math.random() > 0.5 ? 1 : -1) * (240 + Math.random() * 240)}deg`);

        document.body.appendChild(piece);
        piece.addEventListener('animationend', () => piece.remove());
    }
}

document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--tilt-x', `${px * 16}deg`);
        card.style.setProperty('--tilt-y', `${py * -16}deg`);
    });

    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
    });
});

const originalTitle = document.title;
let titleTimeout = null;

document.addEventListener('visibilitychange', () => {
    clearTimeout(titleTimeout);
    if (document.hidden) {
        document.title = 'Jangan pergi dulu \u2661';
    } else {
        document.title = originalTitle;
    }
});
