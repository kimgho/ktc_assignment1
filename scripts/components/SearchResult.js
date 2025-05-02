import { getSearchMovies } from '../api/index.js';
import { displayMovies } from './MovieList.js'

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    const resultsContainer = document.getElementById('search-results-container');
    const resultsTitle = document.getElementById('search-results-title');
    const backButton = document.getElementById('back-btn');
    if (!query) {
        if (resultsContainer) {
            resultsContainer.innerHTML = '<p>검색어를 입력하여 영화를 찾아보세요.</p>';
        }
        if (resultsTitle) {
            resultsTitle.textContent = '검색 결과';
        }
        return;
    }
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }
    executeSearchOnResultsPage(query, resultsContainer, resultsTitle);
});

const executeSearchOnResultsPage = async (query, containerElement, titleElement) => {
    if (titleElement) {
        titleElement.textContent = `"${query}" 검색 중...`;
    }
    if (containerElement) {
        containerElement.innerHTML = '<p>검색 중...</p>';
    }


    try {
        const movies = await getSearchMovies(query);

        displayMovies(movies, containerElement.id);

        updateResultsTitle(query, movies.length, titleElement);

        if (movies.length === 0) {
            displayNoResultsMessage(containerElement);
        }

    } catch (error) {
        handleResultsError(error, containerElement);
    }
}

const updateResultsTitle = (query, resultCount, titleElement) => {
    if (titleElement) {
        titleElement.textContent = `"${query}" 검색 결과 (${resultCount}건)`;
    }
}

const displayNoResultsMessage = (containerElement) => {
    if (containerElement) {
        containerElement.innerHTML = '<p>검색 결과가 없습니다.</p>';
    }
}

const handleResultsError = (error, containerElement) => {
    console.error('영화 검색 중 오류 발생:', error);
    if (containerElement) {
        containerElement.innerHTML = `<p>검색 오류: ${error.message}</p>`;
    }
}
