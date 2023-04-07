import axios from 'axios';
import config from '../config.json';
import {
    message
} from 'antd';

export const BASE_URL = `http://localhost:${config.BACKEND_PORT}`;
export function getToken() {
    const token = window.localStorage.getItem('token') || '';
    return token;
}
const fetchData = axios.create({
    baseURL: BASE_URL
})
fetchData.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error)
    }
)
fetchData.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        message.error(error.response.data.error)
        return Promise.reject(error)
    }
)
export default fetchData