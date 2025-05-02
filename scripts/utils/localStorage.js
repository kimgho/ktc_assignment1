export const getBookmarkedMovies = () => {
    const bookmarkedMovies = localStorage.getItem('bookmarkedMovies');
    return bookmarkedMovies ? JSON.parse(bookmarkedMovies) : [];
};

export const toggleBookmark = (movieId) => {
    const bookmarkedMovies = getBookmarkedMovies();
    const index = bookmarkedMovies.indexOf(movieId);

    if (index === -1) {
        bookmarkedMovies.push(movieId);
    } else {
        bookmarkedMovies.splice(index, 1);
    }

    localStorage.setItem('bookmarkedMovies', JSON.stringify(bookmarkedMovies));

    updateBookmarkIcon(movieId);
};

export const updateBookmarkIcon = (movieId) => {
    const bookmarkedMovies = getBookmarkedMovies();
    const bookmarkIcon = document.querySelector(`.movie-card[data-id="${movieId}"] .bookmark-icon`);

    if (bookmarkIcon) {
        if (bookmarkedMovies.includes(movieId)) {
            bookmarkIcon.classList.add('active');
            bookmarkIcon.textContent = '★';
        } else {
            bookmarkIcon.classList.remove('active');
            bookmarkIcon.textContent = '☆';
        }
    }
};

export const isMovieBookmarked = (movieId) => {
    const bookmarkedMovies = getBookmarkedMovies();
    return bookmarkedMovies.includes(movieId);
};