/* =============================================
   SHARAD KUMAR PORTFOLIO — SHARED SUB-PAGE JS
   Used by: gtm.html, solution.html, delivery.html
   Each page defines its own `cards` array and
   calls this script after its data block.
   ============================================= */

const desktopPages = [[cards[0], cards[1]], [cards[2], cards[3]]];

function buildCard(card) {
    return `<div class="sub-card">
        <h3>${card.title}</h3>
        <div class="sub-mandate">Mandate: ${card.mandate}</div>
        <div class="sub-narrative">${card.narrative}</div>
        <ul>${card.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        <div class="sub-outcome">${card.outcome}</div>
    </div>`;
}

let desktopPage = 0;

const isTablet = () => window.innerWidth >= 701 && window.innerWidth <= 1024;
const isMobileLandscape = () => window.innerWidth > 700 && window.innerHeight <= 500;

function renderDesktop() {
    document.getElementById('desktop-grid').innerHTML =
        desktopPages[desktopPage].map(buildCard).join('');
    document.getElementById('desktop-counter').textContent =
        (desktopPage + 1) + ' / ' + desktopPages.length;
}

function desktopNav(dir) {
    desktopPage = (desktopPage + dir + desktopPages.length) % desktopPages.length;
    renderDesktop();
}

let mobileCard = 0;

function buildMobileCards() {
    const track = document.getElementById('mobile-track');
    if (!track) return;
    track.innerHTML = '';
    cards.forEach(card => {
        const div = document.createElement('div');
        div.className = 'sub-card';
        div.style.cssText = 'min-width:100%;max-width:100%;flex-shrink:0;box-sizing:border-box;';
        div.innerHTML = `<h3>${card.title}</h3>
            <div class="sub-mandate">Mandate: ${card.mandate}</div>
            <div class="sub-narrative">${card.narrative}</div>
            <ul>${card.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
            <div class="sub-outcome">${card.outcome}</div>`;
        track.appendChild(div);
    });
    updateMobile();
}

function updateMobile() {
    const track   = document.getElementById('mobile-track');
    const counter = document.getElementById('mobile-counter');
    if (!track || !counter) return;
    track.style.transform = `translateX(${-mobileCard * 100}%)`;
    counter.textContent = (mobileCard + 1) + ' / ' + cards.length;
}

function mobileNav(dir) {
    mobileCard = (mobileCard + dir + cards.length) % cards.length;
    updateMobile();
}

let touchStartX = 0;

function initTouch() {
    const track = document.getElementById('mobile-track');
    if (track) {
        track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) mobileNav(diff > 0 ? 1 : -1);
        }, { passive: true });
    }
    const grid = document.getElementById('desktop-grid');
    if (grid) {
        grid.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        grid.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) desktopNav(diff > 0 ? 1 : -1);
        }, { passive: true });
    }
}

function updateSwipeVisibility() {
    const mobile  = document.querySelector('.sub-carousel-mobile');
    const desktop = document.querySelector('.sub-carousel-desktop');
    if (!mobile || !desktop) return;
    if (isMobileLandscape()) {
        mobile.style.display  = 'none';
        desktop.style.display = 'flex';
    } else {
        mobile.style.display  = '';
        desktop.style.display = '';
    }
}

window.addEventListener('load', () => {
    renderDesktop();
    buildMobileCards();
    initTouch();
    updateSwipeVisibility();
});

window.addEventListener('resize', () => {
    renderDesktop();
    updateSwipeVisibility();
});