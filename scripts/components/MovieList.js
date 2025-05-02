import "./MovieCard.js"

export const displayMovies = (movies) => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (!movies || movies.length === 0) {
        resultDiv.innerHTML = '<p>표시할 영화가 없습니다.</p>';
        return;
    }

    const movieGrid = document.createElement('div');
    movieGrid.className = 'movie-grid';

    movies.map((movie) => {
        const movieCard = document.createElement('movie-card');
        movieCard.setAttribute('movie-data', JSON.stringify(movie));
        movieCard.addEventListener('bookmarkChanged', (e) => {
            //TODO : alert 띄우기 ?
            console.log(e.detail);
        })
        movieGrid.appendChild(movieCard);
    });
    resultDiv.appendChild(movieGrid);
}

