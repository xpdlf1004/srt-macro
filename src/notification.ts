export function notifyMe(message: string) {
    if (Notification.permission === "granted") {
        const noti = new Notification(message);
    }
}

export function initNotify() {
    if (!("Notification" in window)) {
        console.info("This browser does not support desktop notification");
    }
    if (Notification.permission !== "denied") {
        Notification.requestPermission(permission => {
            if (permission === "granted") {
                console.info("티켓 알림 설정 완료");
            }
        });
    }
}
