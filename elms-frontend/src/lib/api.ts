import axios, { type InternalAxiosRequestConfig } from 'axios';

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
    const token = localStorage.getItem('token');
    if (token) {
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
