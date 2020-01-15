import axios from "axios";
import qs from "query-string";
import { Train } from "../common/train";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

export function login(params: { userNumber: string; userPassword: string }) {
    return axios.post("/login", params);
}

export function getTrains(params: {
    startStation: string;
    destStation: string;
    requestDate: string;
    requestTime: string;
}) {
    return axios.get<Train[]>(`/trainList?${qs.stringify(params)}`);
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
    return axios.post<string>("/reserveTrain", params);
}
