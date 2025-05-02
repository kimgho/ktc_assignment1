import { getImageUrl } from '../api/index.js';
import { showMovieDetails } from './MovieDetailModal.js';
import { getBookmarkedMovies, toggleBookmark } from '../utils/index.js';
import { debounce } from '../utils/debounce.js';

export class MovieCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['movie-data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'movie-data' && oldValue !== newValue) {
      this.render();
    }
  }

  get movieData() {
    try {
      return JSON.parse(this.getAttribute('movie-data') || '{}');
    } catch (error) {
      console.error('영화 정보 가져오기 에러 - ', error);
      return {};
    }
  }

  render() {
    const movie = this.movieData;
    if (!movie || !movie.id) return;

    const bookmarkedMovies = getBookmarkedMovies();
    const isBookmarked = bookmarkedMovies.includes(movie.id);
    const posterUrl = getImageUrl(movie.poster_path);

    const styles = `
      :host {
        display: block;
      }
      
      .movie-card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: transform 0.3s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      
      .movie-card:hover {
        transform: translateY(-5px);
      }
      
      .movie-poster {
        height: 300px;
        overflow: hidden;
      }
      
      .movie-poster img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .no-poster {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: #f0f0f0;
        color: #999;
        text-align: center;
        padding: 10px;
      }
      
      .movie-info {
        padding: 15px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
      
      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .movie-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-grow: 1;
      }
      
      .bookmark-icon {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #ccc;
        padding: 0 4px;
        transition: color 0.2s, transform 0.2s;
        margin-left: 5px;
      }
      
      .bookmark-icon:hover {
        transform: scale(1.2);
      }
      
      .bookmark-icon.active {
        color: #ffb400;
      }
      
      .movie-rating,
      .movie-release-date {
        font-size: 14px;
        color: #666;
        margin-bottom: 5px;
      }
      
      .movie-overview {
        font-size: 0.9rem;
        margin-top: 8px;
        line-height: 1.4;
        text-align: justify;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        flex-grow: 1;
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="movie-card">
        <div class="movie-poster">
          ${posterUrl ?
        `<img src="${posterUrl}" alt="${movie.title}" loading="lazy">` :
        '<div class="no-poster">이미지 없음</div>'
      }
        </div>
        <div class="movie-info">
          <div class="title-row">
            <h3 class="movie-title">${movie.title}</h3>
            <button class="bookmark-icon ${isBookmarked ? 'active' : ''}" data-id="${movie.id}">
              ${isBookmarked ? '★' : '☆'}
            </button>
          </div>
          <div class="movie-rating">평점: ${movie.vote_average ? movie.vote_average.toFixed(2) : '정보 없음'}</div>
          <div class="movie-release-date">개봉일: ${movie.release_date || '정보 없음'}</div>
          <div class="movie-overview">${movie.overview || '줄거리 정보가 없습니다.'}</div>
        </div>
      </div>
    `;

    this.addEventListeners();
  }

  addEventListeners() {
    const movieCard = this.shadowRoot.querySelector('.movie-card');
    const bookmarkButton = this.shadowRoot.querySelector('.bookmark-icon');

    if (movieCard && bookmarkButton) {
      const debouncedMovieCardClick = debounce(this.handleMovieCardClick.bind(this));
      const debouncedBookmarkClick = debounce(this.handleBookmarkClick.bind(this));
      movieCard.addEventListener('click', (event) => {
        if (event.target === bookmarkButton || bookmarkButton.contains(event.target)) {
          event.stopPropagation();
        } else {
          debouncedMovieCardClick();
        }
      });

      bookmarkButton.addEventListener('click', (event) => {
        event.stopPropagation();
        debouncedBookmarkClick();
      });
    }
  }

  handleBookmarkClick() {
    const movie = this.movieData;
    if (movie && movie.id) {
      toggleBookmark(movie.id);

      const bookmarkButton = this.shadowRoot.querySelector('.bookmark-icon');
      const bookmarkedMovies = getBookmarkedMovies();
      const isBookmarked = bookmarkedMovies.includes(movie.id);

      if (bookmarkButton) {
        bookmarkButton.textContent = isBookmarked ? '★' : '☆';
        bookmarkButton.classList.toggle('active', isBookmarked);
      }

      this.dispatchEvent(new CustomEvent('bookmarkChanged', {
        bubbles: true,
        composed: true,
        detail: { movieId: movie.id, isBookmarked }
      }));
    }
  }

  handleMovieCardClick() {
    const movie = this.movieData;
    if (movie && movie.id) {
      showMovieDetails(movie.id);
    }
  }
}

customElements.define('movie-card', MovieCard);