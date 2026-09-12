const entryScreen = document.getElementById('entryScreen');
const startBtn = document.getElementById('startJourney');
const mainContent = document.getElementById('mainContent');
const bgMusic = document.getElementById('bgMusic');
const mainPlayBtn = document.getElementById('mainPlayBtn');
const mainPlayIcon = mainPlayBtn.querySelector('i');

let isPlaying = false;

startBtn.addEventListener('click', () => {
    entryScreen.classList.add('fade-out');
    
    bgMusic.play().then(() => {
        isPlaying = true;
        mainPlayIcon.className = 'fa-solid fa-pause';
        setDynamicBackground(true);
    }).catch(() => {});
    
    setTimeout(() => {
        mainContent.classList.remove('hidden');
        initObserver();
    }, 1500);
});

const envelopeContainer = document.getElementById('envelopeContainer');
const envelopeHint = document.querySelector('.envelope-hint');
let envelopeOpened = false;

envelopeContainer.addEventListener('click', () => {
    if(!envelopeOpened) {
        envelopeContainer.classList.add('open');
        envelopeHint.style.opacity = '0';
        envelopeOpened = true;
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
        mainPlayIcon.className = 'fa-solid fa-play';
        setDynamicBackground(false);
    } else {
        bgMusic.play();
        mainPlayIcon.className = 'fa-solid fa-pause';
        setDynamicBackground(true);
    }
    isPlaying = !isPlaying;
}

mainPlayBtn.addEventListener('click', togglePlay);

function setDynamicBackground(playState) {
    const albumArtShadow = document.querySelector('.art-shadow');
    const imgUrl = document.getElementById('albumArtImg').src;
    if(playState) {
        albumArtShadow.style.backgroundImage = `url(${imgUrl})`;
    }
}

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
    isPlaying = false;
    mainPlayIcon.className = 'fa-solid fa-play';
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