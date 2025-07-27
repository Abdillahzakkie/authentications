import axios, { type AxiosRequestConfig } from "axios";

/**
 * This function returns an object with two functions, get and post, that return an axios request.
 * @returns An object with two functions.
 */
export default function api() {
    return {
        get: async (url: string, options?: AxiosRequestConfig) => {
            return await axios.get(url, options);
        },
        post: async (url: string, data?: any, options?: AxiosRequestConfig) => {
            return await axios.post(url, data, options);
        }
    };
}
