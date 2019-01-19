import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

export function login(params: { userNumber: string; userPassword: string }) {
    return post(`/login`, params);
}

function post(path: string, body?: any) {
    return axios.post(path, body);
}

function get(path: string) {
    return axios.get(path);
}
