export const searchHandler = () => {
    const headerElement = document.querySelector('.header');
    if (!headerElement) return;

    headerElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('search-button')) {
            const searchWrapper = event.target.closest('.search-wrapper');
            if (searchWrapper) {
                const input = searchWrapper.querySelector('.search-input');
                if (input) {
                    navigateToSearchResults(input.value);
                }
            }
        }
    });
    headerElement.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && event.target.classList.contains('search-input')) {
            navigateToSearchResults(event.target.value);
        }
    });
}

const navigateToSearchResults = (query) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        alert('검색어를 입력해주세요.');
        return;
    }

    const searchResultsPageUrl = `/pages/search-results.html?query=${encodeURIComponent(trimmedQuery)}`;

    window.location.href = searchResultsPageUrl;
}