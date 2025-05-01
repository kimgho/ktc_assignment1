import { getMovieDetails, getImageUrl } from '../api/index.js';

export const showMovieDetails = async (movieId) => {
    try {
        const movie = await getMovieDetails(movieId);

        const fullCast = movie.credits && movie.credits.cast ? movie.credits.cast : [];
        const top7Actors = fullCast.slice(0, 7);

        const actorCardsHtml = top7Actors.map(actor => {
            const profileImageUrl = getImageUrl(actor.profile_path);
            return `
                <div class="actor-card">
                    <div class="actor-profile-image">
                        ${profileImageUrl ?
                    `<img src="${profileImageUrl}" alt="${actor.name} loading="eager"">` :
                    '<div class="no-profile-image">이미지 없음</div>'}
                    </div>
                    <div class="actor-info">
                        <div class="actor-name">${actor.name}</div>
                        <div class="actor-character">${actor.character || '역할 정보 없음'}</div>
                    </div>
                </div>
            `;
        }).join('');

        let modalContainer = document.getElementById('movie-modal-container');

        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'movie-modal-container';
            document.body.appendChild(modalContainer);
        }

        modalContainer.innerHTML = generateMovieModalHtml(movie, actorCardsHtml);

        modalContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setupModalEventListeners(modalContainer);

    } catch (error) {
        console.error('영화 상세 정보를 가져오는 중 오류 발생:', error);
        alert('영화 상세 정보를 불러오는 데 실패했습니다.');
    }
}

const generateMovieModalHtml = (movie, actorCardsHtml) => {
    const posterUrl = getImageUrl(movie.poster_path);
    const backdropUrl = getImageUrl(movie.backdrop_path);

    return `
        <div class="movie-modal">
            <div class="modal-close-btn">&times;</div>
            ${backdropUrl ?
            `<div class="movie-backdrop" style="background-image: url('${backdropUrl}')"></div>` : ''}
            <div class="movie-modal-content">
                <div class="movie-top-section">
                    <div class="movie-poster-large">
                        ${posterUrl ?
            `<img src="${posterUrl}" alt="${movie.title}">` :
            '<div class="no-poster-large">이미지 없음</div>'}
                    </div>
                    <div class="movie-details">
                        <h2>${movie.title} ${movie.release_date ? `(${movie.release_date.substring(0, 4)})` : ''}</h2>
                        <div class="movie-meta">
                            <span class="movie-rating">평점: ${movie.vote_average.toFixed(1)}</span>
                            <span class="movie-runtime">${movie.runtime ? `${movie.runtime}분` : '상영시간 정보 없음'}</span>
                        </div>
                        <div class="movie-genres">
                            ${movie.genres ? movie.genres.map(genre => `<span class="genre">${genre.name}</span>`).join('') : ''}
                        </div>
                        <div class="movie-full-overview">
                            <h3>줄거리</h3>
                            <p>${movie.overview || '줄거리 정보가 없습니다.'}</p>
                        </div>
                    </div>
                </div>
                <div class="movie-cast">
                    <h3>주요 배우</h3>
                    <div class="actor-list">
                        ${actorCardsHtml}
                    </div>
                </div>
            </div>
        </div>
    `;
}

const setupModalEventListeners = (modalContainer) => {
    const closeBtn = modalContainer.querySelector('.modal-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal(modalContainer);
        });
    }

    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal(modalContainer);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.style.display === 'flex') {
            closeModal(modalContainer);
        }
    });
}

const closeModal = (modalContainer) => {
    modalContainer.style.display = 'none';
    document.body.style.overflow = '';
}