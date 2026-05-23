document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Game ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        document.getElementById('game-title').innerText = 'لم يتم العثور على اللعبة!';
        return;
    }

    // 2. Find Game in Data
    const game = gamesData.find(g => g.id === gameId);
    
    if (!game) {
        document.getElementById('game-title').innerText = 'اللعبة غير موجودة!';
        return;
    }

    // 3. Populate Page Elements
    document.title = `${game.title} - أُنَيسِيان`;
    
    // Header
    const gameHeader = document.getElementById('game-header');
    gameHeader.style.backgroundImage = `url('${game.banner}')`;
    document.getElementById('game-cover').src = game.cover;
    document.getElementById('game-title').innerText = game.title;
    
    document.getElementById('game-category').innerText = game.category;
    document.getElementById('game-date').innerText = `تاريخ الإضافة: ${game.dateAdded}`;

    // Status Badge
    const statusBadge = document.getElementById('game-status');
    if (game.status === 'completed') {
        statusBadge.innerText = 'مكتمل';
        statusBadge.classList.add('status-completed');
    } else {
        statusBadge.innerText = 'قيد العمل';
        statusBadge.classList.add('status-ongoing');
    }

    // Description
    document.getElementById('game-description').innerText = game.description;

    // Localization Team
    const locTeamSection = document.getElementById('loc-team-section');
    const locTeamGrid = document.getElementById('loc-team-grid');
    if (game.localizationTeam && game.localizationTeam.length > 0) {
        locTeamSection.style.display = 'block';
        game.localizationTeam.forEach(member => {
            locTeamGrid.innerHTML += `
                <div class="team-member">
                    <strong>${member.role}:</strong> <span>${member.names}</span>
                </div>
            `;
        });
    }

    // Sidebar: Progress or Downloads
    const progressContainer = document.getElementById('game-progress-container');
    const downloadSection = document.getElementById('download-section');
    const downloadButtons = document.getElementById('download-buttons');

    if (game.status === 'ongoing') {
        const progressCards = game.progressCards;
        if (progressCards && progressCards.length > 0) {
            let allCardsHtml = '';
            
            progressCards.forEach(progress => {
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

                allCardsHtml += `
                    <div class="progress-card" style="position: relative; opacity: 1; pointer-events: all; transform: none; width: 100%; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.05); background: rgba(5,5,5,0.5);">
                        <h3 style="margin-bottom: 1.5rem; text-align: center; color: #fff; font-size: 1.4rem;">${progress.title || 'التقدم الحالي'}</h3>
                        <div class="card-header">
                            <div class="circular-progress-container">
                                <div class="circular-progress" style="--progress: ${progress.overall}">
                                    <span class="progress-value">${progress.overall}%</span>
                                </div>
                            </div>
                            <div class="card-title">
                                <h3>النسبة الكلية</h3>
                            </div>
                        </div>
                        <div class="horizontal-progress-list" style="margin-top: 2rem;">
                            ${detailsHtml}
                        </div>
                    </div>
                `;
            });

            progressContainer.innerHTML = allCardsHtml;

            // Animate bars
            setTimeout(() => {
                const barFills = progressContainer.querySelectorAll('.bar-fill');
                barFills.forEach(bar => {
                    const targetWidth = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 50);
                });
            }, 100);
        }
    }

    // Always show Downloads if they exist
    if (game.downloadLinks && game.downloadLinks.length > 0) {
        downloadSection.style.display = 'block';
        game.downloadLinks.forEach(link => {
            downloadButtons.innerHTML += `
                <a href="${link.url}" class="download-btn" target="_blank">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    تحميل لـ ${link.platform}
                </a>
            `;
        });
    }
});
