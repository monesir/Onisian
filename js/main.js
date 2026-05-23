document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- References ---
    const sliderContainer = document.getElementById('hero-slider');
    const dotsContainer = document.getElementById('slider-dots');
    const cardContainer = document.getElementById('hero-progress-card-container');
    const gamesGrid = document.getElementById('games-grid');

    let currentSlide = 0;
    let slideInterval;

    // --- Initialize Hero Slider ---
    function initSlider() {
        if (gamesData.length === 0) {
            sliderContainer.innerHTML = '<div style="color: white; display: flex; align-items: center; justify-content: center; height: 100%; font-size: 1.5rem;">لم تتم إضافة ألعاب بعد</div>';
            return;
        }

        gamesData.forEach((game, index) => {
            // Create Slide
            const slide = document.createElement('div');
            slide.classList.add('slide');
            if (index === 0) slide.classList.add('active');
            slide.style.backgroundImage = `url('${game.banner}')`;
            slide.style.cursor = 'pointer';
            
            // Navigate to game page on click
            slide.addEventListener('click', () => {
                window.location.href = `game.html?id=${game.id}`;
            });

            sliderContainer.appendChild(slide);

            // Create Dot
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        // Controls
        document.getElementById('next-slide').addEventListener('click', nextSlide);
        document.getElementById('prev-slide').addEventListener('click', prevSlide);

        // Auto slide
        startAutoSlide();
        
        // Initial Card Render
        updateProgressCard(currentSlide);
    }

    function goToSlide(index) {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        // Update Dynamic Progress Card!
        updateProgressCard(currentSlide);
        
        resetAutoSlide();
    }

    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= gamesData.length) newIndex = 0;
        goToSlide(newIndex);
    }

    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = gamesData.length - 1;
        goToSlide(newIndex);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // Change every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // --- Dynamic Progress Card Logic ---
    function updateProgressCard(index) {
        const game = gamesData[index];
        
        // Clear current cards
        cardContainer.innerHTML = '';
        
        // Only show cards if game is ongoing
        if (game.status === 'completed') return;

        const progressCards = game.progressCards;
        if (!progressCards || progressCards.length === 0) return;
        
        progressCards.forEach((progress, i) => {
            // Build HTML for details
            let detailsHtml = '';
            if (progress.details && progress.details.length > 0) {
                progress.details.forEach(detail => {
                    detailsHtml += `
                        <div class="horizontal-bar-item">
                            <div class="bar-header">
                                <span>${detail.label}</span>
                                <span class="bar-value">${detail.value}%</span>
                            </div>
                            <div class="bar-track">
                                <div class="bar-fill" style="width: ${detail.value}%"></div>
                            </div>
                        </div>
                    `;
                });
            }
            
            const cardCover = progress.cover || game.cover;

            const cardHTML = `
                <div class="progress-card" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.95) 60%, #000000 100%), url('${cardCover}')">
                    <div class="card-header">
                        <div class="circular-progress-container">
                            <div class="circular-progress" style="--progress: ${progress.overall}">
                                <span class="progress-value">${progress.overall}%</span>
                            </div>
                        </div>
                        <div class="card-title">
                            <a href="game.html?id=${game.id}" style="color: inherit; text-decoration: none;">
                                <h3 style="font-size: 1.3rem; margin-bottom: 0.2rem; line-height: 1.3;">${progress.title || 'التقدم الحالي'}</h3>
                                <div dir="ltr" style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.3rem; text-align: right;">${game.title}</div>
                            </a>
                        </div>
                    </div>
                    <div class="horizontal-progress-list">
                        ${detailsHtml}
                    </div>
                </div>
            `;
            
            cardContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Animate the horizontal bars on load by resetting and setting their width
        const barFills = cardContainer.querySelectorAll('.bar-fill');
        barFills.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 50);
        });
    }

    // --- Initialize Games Library Grid ---
    function initLibrary() {
        if (gamesData.length === 0) {
            gamesGrid.innerHTML = '<div style="color: white; text-align: center; grid-column: 1 / -1; padding: 3rem; font-size: 1.2rem;">المكتبة فارغة حالياً</div>';
            return;
        }

        gamesData.forEach(game => {
            const card = document.createElement('a');
            card.href = `game.html?id=${game.id}`;
            card.style.color = 'inherit';
            card.style.display = 'block';
            card.classList.add('game-grid-card');
            
            const statusClass = game.status === 'completed' ? 'status-completed' : 'status-ongoing';
            const statusText = game.status === 'completed' ? 'مكتمل' : 'قيد العمل';

            card.innerHTML = `
                <img src="${game.cover}" alt="${game.title}" class="game-grid-cover">
                <div class="game-grid-info" style="display: flex; flex-direction: column; gap: 0.8rem; width: 100%;">
                    <h3 dir="ltr" style="text-align: left; margin: 0; line-height: 1.3;">${game.title}</h3>
                    <div style="text-align: right;">
                        <span class="game-grid-status ${statusClass}">${statusText}</span>
                    </div>
                </div>
            `;
            gamesGrid.appendChild(card);
        });
    }

    // Run Initialization
    initSlider();
    initLibrary();
});
