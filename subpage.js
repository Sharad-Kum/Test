/* =============================================
   SHARAD KUMAR PORTFOLIO — SHARED SUB-PAGE JS
   Used by: gtm.html, solution.html, delivery.html
   Each page defines its own `cards` array and
   calls this script after its data block.
   ============================================= */

const SWIPE_THRESHOLD_PX = 40;
const LANDSCAPE_MIN_WIDTH_PX = 700;
const LANDSCAPE_MAX_HEIGHT_PX = 500;

// Chunks `cards` into groups of 2 for desktop paging. Generalized from the
// original hardcoded [[0,1],[2,3]] so pages with more than 4 cards (e.g.
// ai.html's 6 cards) page correctly too — behaves identically for 4 cards.
function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

const desktopPages = chunk(cards, 2);

function buildCard(card) {
    return `<div class="sub-card">
        <h3>${card.title}</h3>
        <div class="sub-mandate">${card.mandate}</div>
        <div class="sub-narrative">${card.narrative}</div>
        <ul>${card.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        <div class="sub-outcome">${card.outcome}</div>
    </div>`;
}

// Updates the "Key Highlights" section title to include the current
// category (e.g. "Key Highlights — Solution") when cards carry a
// `category` field, so it's stated once per page-turn instead of
// repeated on every card. Pages whose cards have no category (gtm,
// solution, delivery) leave the title at its plain default — this
// only activates for pages like ai.html that mix categories.
function updateSectionTitle(category) {
    const title = document.getElementById('section-title');
    if (!title) return;
    title.textContent = category ? `Key Highlights \u2014 ${category}` : 'Key Highlights';
}

let desktopPage = 0;

const isMobileLandscape = () => window.innerWidth > LANDSCAPE_MIN_WIDTH_PX && window.innerHeight <= LANDSCAPE_MAX_HEIGHT_PX;

function renderDesktop() {
    const pageCards = desktopPages[desktopPage];
    document.getElementById('desktop-grid').innerHTML =
        pageCards.map(buildCard).join('');
    document.getElementById('desktop-counter').textContent =
        (desktopPage + 1) + ' / ' + desktopPages.length;
    updateSectionTitle(pageCards[0] && pageCards[0].category);
}

function desktopNav(dir) {
    desktopPage = (desktopPage + dir + desktopPages.length) % desktopPages.length;
    renderDesktop();
}

let mobileCard = 0;

function buildMobileCards() {
    const track = document.getElementById('mobile-track');
    if (!track) return;
    track.innerHTML = cards.map(card => {
        const html = buildCard(card);
        // C1: swap the inline cssText that used to live here for a proper CSS class
        return html.replace('class="sub-card"', 'class="sub-card sub-swipe-card"');
    }).join('');
    updateMobile();
}

function updateMobile() {
    const track   = document.getElementById('mobile-track');
    const counter = document.getElementById('mobile-counter');
    if (!track || !counter) return;
    track.style.transform = `translateX(${-mobileCard * 100}%)`;
    counter.textContent = (mobileCard + 1) + ' / ' + cards.length;
    updateSectionTitle(cards[mobileCard] && cards[mobileCard].category);
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
            if (Math.abs(diff) > SWIPE_THRESHOLD_PX) mobileNav(diff > 0 ? 1 : -1);
        }, { passive: true });
    }
    const grid = document.getElementById('desktop-grid');
    if (grid) {
        grid.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        grid.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > SWIPE_THRESHOLD_PX) desktopNav(diff > 0 ? 1 : -1);
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