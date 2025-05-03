import { fetchMovies } from './api/index.js';
import { displayMovies } from './components/MovieList.js';
import { searchHandler } from './utils/searchHandler.js';

document.addEventListener('DOMContentLoaded', function () {
  App();
});

async function App() {
  searchHandler();
  const currentPath = window.location.pathname;
  const isIndexPage = currentPath.endsWith('/pages/index.html');
  if (isIndexPage) {
    try {
      const movies = await fetchMovies();
      if (movies.popularMovies) {
        displayMovies(movies.popularMovies, 'popular-movies-result');
      } else {
        console.warn("인기 영화 정보를 가져오지 못했습니다.");
      }
      if (movies.topRatedMovies) {
        displayMovies(movies.topRatedMovies, 'top-rated-movies-result');
      } else {
        console.warn("TOP Rate 영화 정보를 가져오지 못했습니다.");
      }

    } catch (error) {
      console.error('앱 초기화 중 오류 발생:', error);
      document.getElementById('popular-movies-result').innerHTML = `<p>오류: ${error.message}</p>`;
    }
  } else {
    const popularContainer = document.getElementById('popular-movies-result');
    if (popularContainer) popularContainer.innerHTML = '';
    const topRatedContainer = document.getElementById('top-rated-movies-result');
    if (topRatedContainer) topRatedContainer.innerHTML = '';
  }
}