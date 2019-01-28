export interface Schedule {
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
    trainId: string;
}
