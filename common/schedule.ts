export interface Schedule {
    id: number;
    startPoint: string;
    destPoint: string;
    startTime: Date;
    destTime: Date;
    seatType: "normal" | "special";
    age: "adult" | "kid";
    quantity: number;
}
