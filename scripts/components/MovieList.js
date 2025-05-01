import { getImageUrl } from '../api/index.js';
import { showMovieDetails } from './MovieDetailModal.js';

export const displayMovies = (movies) => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (!movies || movies.length === 0) {
        resultDiv.innerHTML = '<p>표시할 영화가 없습니다.</p>';
        return;
    }

    const movieGrid = document.createElement('div');
    movieGrid.className = 'movie-grid';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-card';
        movieElement.dataset.id = movie.id;

        const posterUrl = getImageUrl(movie.poster_path);

        movieElement.innerHTML = `
            <div class="movie-poster">
                ${posterUrl ?
                `<img src="${posterUrl}" alt="${movie.title}" loading="lazy">` :
                '<div class="no-poster">이미지 없음</div>'}
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-rating">평점: ${movie.vote_average.toFixed(2)}</div>
                <div class="movie-release-date">개봉일: ${movie.release_date || '정보 없음'}</div>
                <div class="movie-overview">${movie.overview || '줄거리 정보가 없습니다.'}</div>
            </div>
        `;

        movieElement.addEventListener('click', () => {
            showMovieDetails(movie.id);
        });

        movieGrid.appendChild(movieElement);
    });

    resultDiv.appendChild(movieGrid);
}