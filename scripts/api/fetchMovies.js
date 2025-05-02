import { getPopularMovies, getTopRatedMovies } from "./index.js"

export const fetchMovies = async () => {
    try {
        const [popularMovies, topRatedMovies] = await Promise.all([
            getPopularMovies(),
            getTopRatedMovies()
        ])
        return {
            popularMovies, topRatedMovies
        }
    } catch (error) {
        console.error("영화 데이터를 가져오는 과정에서 오류", error)
    }
}