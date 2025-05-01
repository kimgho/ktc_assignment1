import { ErrorHandler } from './index.js';
import { API_KEY, BASE_URL, SET_LANGUAGE } from "../consts/index.js";

export const baseFetch = async (endpoint, params = {}) => {
    let queryString = `api_key=${API_KEY}&${SET_LANGUAGE}`;

    for (const [key, value] of Object.entries(params)) {
        queryString += `&${key}=${value}`;
    }
    try {
        const response = await fetch(`${BASE_URL}${endpoint}?${queryString}`);

        if (!response.ok) {
            throw new ErrorHandler(`ERROR : ${response.status}`, {
                status: response.status,
                statusText: response.statusText,
                type: 'GET ERROR'
            });
        }

        return await response.json();
    } catch (error) {
        console.error(`API 요청 중 오류 발생 (${endpoint}):`, error);

        if (error instanceof ErrorHandler) {
            throw error;
        } else {
            throw new ErrorHandler(`API 요청 실패: ${endpoint}`, {
                originalError: error.message,
                name: error.name,
                type: 'FETCH_ERROR'
            });
        }
    }
}