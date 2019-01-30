export interface Schedule {
    id: string;
    startPoint: string;
    startStation: string;
    destPoint: string;
    destStation: string;
    date: string;
    startTime: string;
    destTime: string;
    seatType: "normal" | "special";
    adultCount: number;
    childCount: number;
    error?: string;
    ticketingExpiredTime?: number;
    status: "error" | "waitForPay" | "running";
    trainId: string;
}
