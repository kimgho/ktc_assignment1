import { getSearchMovies } from '../api/index.js';
import { displayMovies } from '../components/MovieList.js';

export const searchHandler = () => {
    const headerElement = document.querySelector('.header');
    if (!headerElement) return;

    headerElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('search-button')) {
            const searchWrapper = event.target.closest('.search-wrapper');
            if (searchWrapper) {
                const input = searchWrapper.querySelector('.search-input');
                if (input) {
                    executeSearch(input.value);
                }
            }
        }
    });

    headerElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && event.target.classList.contains('search-input')) {
            executeSearch(event.target.value);
        }
    });
}

const executeSearch = async (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        alert('검색어를 입력해주세요.');
        return;
    }

    try {
        const movies = await getSearchMovies(trimmedQuery);

        displayMovies(movies);

        updateSearchTitle(trimmedQuery, movies.length);

        if (movies.length === 0) {
            displayNoResultsMessage();
        }
    } catch (error) {
        handleSearchError(error);
    }
}

const updateSearchTitle = (query, resultCount) => {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.textContent = `"${query}" 검색 결과 (${resultCount}건)`;
    }
}

const displayNoResultsMessage = () => {
    document.getElementById('result').innerHTML = '<p>검색 결과가 없습니다.</p>';
}

const handleSearchError = (error) => {
    console.error('영화 검색 중 오류 발생:', error);
    document.getElementById('result').innerHTML = `<p>검색 오류: ${error.message}</p>`;
}