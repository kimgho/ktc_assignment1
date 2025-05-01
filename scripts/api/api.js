import { baseFetch, ErrorHandler } from './index.js';
import { IMAGE_BASE_URL } from "../consts/index.js";

/**
 * 인기 영화 GET 요청
 * @returns 인기 영화 목록
 */
export const getPopularMovies = async () => {
    try {
        const response = await baseFetch('/movie/popular');
        console.log('인기 영화 목록', response);
        return response.results;
    } catch (error) {
        console.error('인기 영화 목록을 가져오는 중 오류 발생:', error);
        throw new ErrorHandler('인기 영화 가져오기 실패', {
            originalError: error.message,
            name: error.name,
            type: 'POPULAR MOVIE FETCH ERROR'
        })
    }
}

/**
 * 영화 검색 GET 요청
 * @param {string} query (영화 제목)
 * @returns 검색 영화 정보
 */
export const getSearchMovies = async (query) => {
    try {
        const response = await baseFetch('/search/movie', {
            query: query
        });
        console.log('검색 결과:', response);
        return response.results;
    } catch (error) {
        console.error('영화 검색 중 오류 발생:', error);
        throw new ErrorHandler('영화 검색 실패', {
            originalError: error.message,
            name: error.name,
            type: 'SEARCH MOVIE FETCH ERROR'
        })
    }
}

/**
 * 영화 상세 정보 GET 요청
 * @param {number} movieId 
 * @returns movieId를 가진 영화의 상세 정보
 */
export const getMovieDetails = async (movieId) => {
    try {
        const data = await baseFetch(`/movie/${movieId}`, { append_to_response: 'credits' });
        console.log('영화 상세 정보:', data);
        return data;
    } catch (error) {
        console.error('영화 상세 정보를 가져오는 중 오류 발생:', error);
        throw new ErrorHandler(`${movieId}번 영화 가져오기 실패`, {
            originalError: error.message,
            name: error.name,
            type: 'FETCH_ERROR'
        });
    }
}

/**
 * 이미지 URL 생성 함수
 * @param {string} path 
 * @returns 전체 이미지 URL
 */
export const getImageUrl = (path) => {
    return path ? `${IMAGE_BASE_URL}${path}` : '';
}