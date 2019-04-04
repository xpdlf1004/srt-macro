import axios from "axios";
import qs from "query-string";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

export function login(params: { userNumber: string; userPassword: string }) {
    return post(`/login`, params);
}

export function getTrains(params: {
    startStation: string;
    destStation: string;
    requestDate: string;
    requestTime: string;
}) {
    return get(`/trainList?${qs.stringify(params)}`);
}

export function reserveTrain(params: {
    date: string;
    startTime: string;
    startPoint: string;
    destPoint: string;
    seatType: "normal" | "special";
    trainId: string;
    childCount: number;
    adultCount: number;
}) {
    return post("/reserveTrain", params);
}

function post(path: string, body?: any) {
    return axios
        .post(path, body)
        .catch(error => {
            return Promise.reject(error);
        })
        .then(r => {
            if (r.status >= 400) {
                console.log(`${"POST"} ${path}: ${r.statusText}`);
                return Promise.reject(
                    new Error(`${"POST"} ${path}: ${r.statusText}`)
                );
            }
            return r.data;
        });
}

function get(path: string) {
    return axios
        .get(path)
        .catch(error => {
            return Promise.reject(error);
        })
        .then(r => {
            if (r.status >= 400) {
                console.log(`${"GET"} ${path}: ${r.statusText}`);
                return Promise.reject(
                    new Error(`${"GET"} ${path}: ${r.statusText}`)
                );
            }
            return r.data;
        });
}
