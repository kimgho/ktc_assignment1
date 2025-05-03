import { getBookmarkedMovies, toggleBookmark } from "../utils/localStorage.js";
import "./MovieCard.js"
import { showMovieDetails } from "./MovieDetailModal.js";

export const displayMovies = (movies, containerId) => {
    const resultDiv = document.getElementById(containerId);
    if (!resultDiv) return;

    resultDiv.innerHTML = '';

    if (!movies || movies.length === 0) {
        resultDiv.innerHTML = '<p>표시할 영화가 없습니다.</p>';
        return;
    }

    const movieGrid = document.createElement('div');
    movieGrid.className = 'movie-grid';

    movies.forEach((movie) => {
        const movieCard = document.createElement('movie-card');
        movieCard.setAttribute('movie-data', JSON.stringify(movie));
        movieGrid.appendChild(movieCard);
    });

    movieGrid.addEventListener('click', (event) => {
        const path = event.composedPath();

        const movieCardElement = path.find(element =>
            element.tagName === 'MOVIE-CARD'
        );

        if (!movieCardElement) return;

        const bookmarkBtn = path.find(element =>
            element.classList && element.classList.contains('bookmark-icon')
        );

        if (bookmarkBtn) {
            const movieId = parseInt(bookmarkBtn.dataset.id, 10);
            if (movieId) {
                toggleBookmark(movieId);
                if (typeof movieCardElement.updateBookmarkIcon === 'function') {
                    movieCardElement.updateBookmarkIcon();
                    const isBookmarked = getBookmarkedMovies().includes(movieId);
                    console.log(`${movieId} bookMarked to ${isBookmarked}`);
                }
            }
        } else {
            const movieData = movieCardElement.movieData;
            if (movieData && movieData.id) {
                showMovieDetails(movieData.id);
            }
        }
    });

    resultDiv.appendChild(movieGrid);
}