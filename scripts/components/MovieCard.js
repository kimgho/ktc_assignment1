import { getImageUrl } from '../api/index.js';
import { getBookmarkedMovies } from '../utils/index.js';

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
      const data = this.getAttribute('movie-data');
      return data ? JSON.parse(data) : {};
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
        background-color: #1e1e1e;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        height: 100%;
        border: 1px solid #333;
      }
      
      .movie-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        border-color: #444;
      }
      
      .movie-poster {
        height: 300px;
        overflow: hidden;
        position: relative;
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
        background-color: #2a2a2a;
        color: #999;
        text-align: center;
        padding: 10px;
      }
      
      .movie-info {
        padding: 15px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        background-color: #1e1e1e;
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
        color: #f8f8f8;
      }
      
      .bookmark-icon {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #666;
        padding: 0 4px;
        transition: color 0.2s, transform 0.2s;
        margin-left: 5px;
      }
      
      .bookmark-icon:hover {
        transform: scale(1.2);
        color: #ffb400;
      }
      
      .bookmark-icon.active {
        color: #ffb400;
      }
      
      .movie-rating,
      .movie-release-date {
        font-size: 14px;
        color: #aaa;
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
        color: #ccc;
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

  }
  updateBookmarkIcon() {
    const movie = this.movieData;
    if (!movie || !movie.id) return;

    const bookmarkBtn = this.shadowRoot.querySelector('.bookmark-icon');
    if (bookmarkBtn) {
      const bookmarkedMovies = getBookmarkedMovies();
      const isBookmarked = bookmarkedMovies.includes(movie.id);
      bookmarkBtn.textContent = isBookmarked ? '★' : '☆';
      bookmarkBtn.classList.toggle('active', isBookmarked);
    }
  }
}

customElements.define('movie-card', MovieCard);