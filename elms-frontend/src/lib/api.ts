import axios, { type InternalAxiosRequestConfig } from 'axios';

import type { ApiResponse, ApiErrorBody} from '@/types/api';

export const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

/** In-flight controllers keyed by method + url + params — abort prior duplicate. */
const pendingControllers = new Map<string, AbortController>();

function getRequestKey(config: InternalAxiosRequestConfig): string {
    const method = (config.method ?? 'get').toUpperCase();
    const url = config.url ?? '';
    const params = config.params ? JSON.stringify(config.params) : '';
    return `${method}:${url}:${params}`;
}

api.interceptors.request.use((config) => {
    const isLoginRequest = config.method?.toLowerCase() === 'post' && (config.url === '/' || config.url === '');
    const token = localStorage.getItem('token');
    if (token && !isLoginRequest) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }

    const key = getRequestKey(config);

    // cancel the previous in-flight request with the same key
    pendingControllers.get(key)?.abort();

    const controller = new AbortController();
    pendingControllers.set(key, controller);

    // if the caller already passed a signal (e.g. useEffect cleanup), link it
    const userSignal = config.signal;
    if (userSignal) {
        if (userSignal.aborted) {
            controller.abort();
        } else {
            userSignal.addEventListener('abort', () => controller.abort?.(), { once: true });
        }
    }

    config.signal = controller.signal;
    return config;
});

api.interceptors.response.use(
    (response) => {
        pendingControllers.delete(getRequestKey(response.config));
        return response;
    },
    (error) => {
        if (error.config) {
            pendingControllers.delete(getRequestKey(error.config));
        }
        return Promise.reject(error);
    }
);


/**
 * Get the error message from the error object
 * @param error - The error object
 * @param fallbackMessage - The fallback message to return if the error is unknown
 * @returns The error message
 */
export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {

    /** If the request is cancelled, return an empty string */
    if(axios.isCancel(error)) {
        return "";
    }

    // If the error is an Axios error and the response is an ApiErrorBody, return the message
    if(axios.isAxiosError<ApiErrorBody>(error)) {
        return error.response?.data?.message ?? fallbackMessage;
    }
    
    // if the error is an Error object, return the message (unknown or unexpected error)
    if(error instanceof Error) {
        return error.message;
    }

    // if the error is unknown, return the fallback message
    return fallbackMessage

}
