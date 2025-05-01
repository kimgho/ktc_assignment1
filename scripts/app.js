import { getPopularMovies } from './api/index.js';
import { displayMovies } from './components/MovieList.js';
import { searchHandler } from './utils/searchHandler.js';

document.addEventListener('DOMContentLoaded', function () {
  App();
});

async function App() {
  try {
    searchHandler();
    const movies = await getPopularMovies();
    displayMovies(movies);
  } catch (error) {
    console.error('앱 초기화 중 오류 발생:', error);
    document.getElementById('result').innerHTML = `<p>오류: ${error.message}</p>`;
  }
}