import * as express from "express";
import * as bodyParser from "body-parser";
import axios from "axios";
import * as qs from "qs";
import * as session from "express-session";
import * as cheerio from "cheerio";
import * as morgan from "morgan";
import * as cors from "cors";
import * as HttpStatus from "http-status-codes";
import { Train } from "../common/train";
import * as moment from "moment";

const app = express();

app.use(morgan("tiny"));
app.use(cors({ credentials: true, origin: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.set("trust proxy", 1); // trust first proxy

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { httpOnly: false }
    })
);

app.post("/login", (req, res, next) => {
    axios
        .post(
            "https://etk.srail.co.kr/cmc/01/selectLoginInfo.do?pageId=TK0701000000",
            qs.stringify({
                srchDvNm: req.body.userNumber,
                hmpgPwdCphd: req.body.userPassword,
                srchDvCd: "1"
            })
        )
        .then(response => {
            if (
                response.data &&
                response.data.includes("location.replace('/main.do');")
            ) {
                // 로그인 성공
                // 쿠키값 세션에 저장
                if (
                    response.headers &&
                    response.headers["set-cookie"] &&
                    response.headers["set-cookie"].length > 0
                ) {
                    const sessionKey = response.headers["set-cookie"][0]
                        .split(";")[0]
                        .split("JSESSIONID_ETK=")[1];
                    req.session!.JSESSIONID_ETK = sessionKey;
                    req.session!.expires = false;
                }
                res.status(HttpStatus.OK).send("success");
            } else {
                res.status(HttpStatus.BAD_REQUEST).send(
                    "invalid id or password"
                );
            }
        })
        .catch(next);
});

app.get("/trainList", (req, res, next) => {
    const startStation = req.query.startStation;
    const destStation = req.query.destStation;
    // YYYYMMDD
    const requestDate = req.query.requestDate;
    // HH
    const requestTime = req.query.requestTime;
    axios
        .post(
            "https://etk.srail.co.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000",
            qs.stringify({
                dptRsStnCd: startStation,
                arvRsStnCd: destStation,
                stlbTrnClsfCd: "05",
                psgNum: "1",
                seatAttCd: "015",
                isRequest: "Y",
                dptDt: requestDate,
                dptTm: requestTime + "0000",
                chtnDvCd: "1",
                // 어른
                psgInfoPerPrnb1: "1",
                // 어린이
                psgInfoPerPrnb5: "0",
                psgInfoPerPrnb4: "0",
                psgInfoPerPrnb2: "0",
                psgInfoPerPrnb3: "0",
                locSeatAttCd1: "000",
                rqSeatAttCd1: "015",
                trnGpCd: "300"
            })
        )
        .then(response => {
            const $ = cheerio.load(response.data);
            const trainList: Train[] = [];
            $("#result-form table tbody tr").each((trIndex, trElem) => {
                const tdElem = $(trElem).find("td");
                if (tdElem.length === 11) {
                    const trainId = $(tdElem[2])
                        .text()
                        .trim();
                    const startTimeText = $(tdElem[3])
                        .text()
                        .trim();
                    const startTimeIndex = startTimeText.match(/[0-9]/)!.index;
                    const startTime = startTimeText.slice(startTimeIndex);
                    const destTimeText = $(tdElem[4])
                        .text()
                        .trim();
                    const destTimeIndex = destTimeText.match(/[0-9]/)!.index;
                    const destTime = destTimeText.slice(destTimeIndex);
                    const duration = $(tdElem[10])
                        .text()
                        .trim();
                    trainList.push({
                        startTime,
                        destTime,
                        duration,
                        trainId
                    });
                }
            });
            res.status(HttpStatus.OK).send(trainList);
        })
        .catch(next);
});

app.post("/checkLogin", (req, res) => {
    if (req.session!.JSESSIONID_ETK) {
        res.status(HttpStatus.OK).send("logged in");
    } else {
        res.status(HttpStatus.UNAUTHORIZED).send("not logged in");
    }
});

app.post("/logout", (req, res, next) => {
    req.session!.destroy(err => {
        if (err) {
            next(err);
        } else {
            res.status(HttpStatus.OK).send("loggout");
        }
    });
});

app.post("/reserveTrain", async (req, res, next) => {
    function checkUserInfo(params: {
        date: string;
        startTime: string;
        trainId: string;
        startPoint: string;
        destPoint: string;
        seatType: string;
        childCount: number;
        adultCount: number;
    }) {
        return axios.post(
            "https://etk.srail.co.kr/hpg/hra/01/checkUserInfo.do?pageId=TK0101010000",
            qs.stringify({
                rsvTpCd: "01",
                jobId: "1101",
                jrnyTpCd: "11",
                jrnyCnt: "1",
                totPrnb: params.childCount + params.adultCount,
                stndFlg: "N",
                // trnOrdrNo1: '1', // 기차 순번 Optional
                jrnySqno1: "001",
                runDt1: params.date, // 출발 날짜 ex) 20180212
                trnNo1: `00${params.trainId}`, // 기차번호 ex) 00339
                trnGpCd1: "300",
                stlbTrnClsfCd1: "17",
                dptDt1: params.date, // 출발 날짜 ex) 20180212
                dptTm1: params.startTime, // 출발 시간 ex) 144600
                dptRsStnCd1: params.startPoint, // 출발역 ex) 0010
                // dptStnConsOrdr1: '000001',// 출발역 Optional
                // dptStnRunOrdr1: '000001',// 출발역 Optional
                arvRsStnCd1: params.destPoint, // 도착역 ex) 0020
                // arvStnConsOrdr1: '000020',// 도착역 Optional
                // arvStnRunOrdr1: '000006',// 도착역 Optional
                scarYn1: "N",
                scarGridcnt1: "",
                scarNo1: "",
                seatNo1_1: "",
                seatNo1_2: "",
                seatNo1_3: "",
                seatNo1_4: "",
                seatNo1_5: "",
                seatNo1_6: "",
                seatNo1_7: "",
                seatNo1_8: "",
                seatNo1_9: "",
                psrmClCd1: params.seatType === "normal" ? 1 : 2, // 일반 1, 특실 2
                smkSeatAttCd1: "000",
                dirSeatAttCd1: "000",
                locSeatAttCd1: "000",
                rqSeatAttCd1: "015",
                etcSeatAttCd1: "000",
                psgGridcnt: "1",
                psgTpCd1: params.adultCount > 0 ? "1" : "",
                psgInfoPerPrnb1: params.adultCount > 0 ? params.adultCount : "", // 인원수 인듯 ?
                psgTpCd2: params.childCount > 0 ? "5" : "", // 5 (어린이)
                psgInfoPerPrnb2: params.childCount > 0 ? params.childCount : "", // 어린이 일듯?
                psgTpCd3: "",
                psgInfoPerPrnb3: "",
                psgTpCd4: "",
                psgInfoPerPrnb4: "",
                psgTpCd5: "",
                psgInfoPerPrnb5: "",
                mutMrkVrfCd: "",
                reqTime: new Date().getTime(),
                crossYn: "N"
            }),
            {
                headers: {
                    Cookie: "JSESSIONID_ETK=" + req.session!.JSESSIONID_ETK
                }
            }
        );
    }

    function requestReservationInfo() {
        return axios.get(
            "https://etk.srail.co.kr/hpg/hra/02/requestReservationInfo.do?pageId=TK0101030000",
            {
                headers: {
                    Cookie: "JSESSIONID_ETK=" + req.session!.JSESSIONID_ETK
                }
            }
        );
    }

    function confirmReservationInfo() {
        return axios.get(
            "https://etk.srail.co.kr/hpg/hra/02/confirmReservationInfo.do?pageId=TK0101030000",
            {
                headers: {
                    Cookie: "JSESSIONID_ETK=" + req.session!.JSESSIONID_ETK
                }
            }
        );
    }

    if (!req.session!.JSESSIONID_ETK) {
        res.status(HttpStatus.UNAUTHORIZED).send();
        return;
    }
    const date = req.body.date;
    const startTime = req.body.startTime;
    const trainId = req.body.trainId;
    const startPoint = req.body.startPoint;
    const destPoint = req.body.destPoint;
    const seatType = req.body.seatType;
    const childCount = parseInt(req.body.childCount, 10);
    const adultCount = parseInt(req.body.adultCount, 10);

    const dateText = `${moment(date, "YYYY-MM-DD (hhh)").format("YYYYMMDD")}`;
    const startTimeText = `${moment(startTime, "HH:mm").format("HHmm")}00`;
    try {
        const checkUserInfoResponse = await checkUserInfo({
            date: dateText,
            startTime: startTimeText,
            trainId,
            startPoint,
            destPoint,
            seatType,
            childCount,
            adultCount
        });
        if (checkUserInfoResponse.data.includes("selectLoginForm.do")) {
            res.status(HttpStatus.UNAUTHORIZED).send("invalid token");
            return;
        }
        await requestReservationInfo();
        const confirmReservationInfoResponse = await confirmReservationInfo();
        if (confirmReservationInfoResponse.data.includes("잔여석없음")) {
            res.status(HttpStatus.OK).send("full");
        } else if (
            confirmReservationInfoResponse.data.includes("열차구간정보오류")
        ) {
            res.status(HttpStatus.OK).send("잘못된 열차 설정");
        } else if (
            confirmReservationInfoResponse.data.includes(
                "20분 이내 열차는 예약하실 수 없습니다."
            )
        ) {
            res.status(HttpStatus.OK).send("잘못된 시간 설정");
        } else if (
            confirmReservationInfoResponse.data.includes(
                "10분 내에 결제하지 않으면 예약이 취소됩니다."
            )
        ) {
            res.status(HttpStatus.OK).send("ok");
        } else if (confirmReservationInfoResponse.data.includes("ERROR")) {
            res.status(HttpStatus.OK).send("ERROR");
        } else {
            next();
        }
    } catch (e) {
        next(e);
    }
});

app.get("/stationList", (req, res, next) => {
    axios
        .post(
            "https://etk.srail.co.kr/hpg/hra/01/selectMapInfo.do?isAll=Y&other=&target=dpt&pageId=TK0101010000"
        )
        .then(response => {
            const $ = cheerio.load(response.data);
            const stationList: any = [];
            $("#wrap .map>ul>li").each((index, elem) => {
                $(elem)
                    .find("ul li")
                    .each((i, e) => {
                        const aTag = $(e).find("a");
                        if (aTag.length > 0) {
                            const clickEvent = $(aTag[0])
                                .attr("onclick")
                                .split("'");
                            const id = clickEvent[1];
                            const name = clickEvent[3];
                            stationList.push({
                                id,
                                name
                            });
                        }
                    });
            });
            res.status(200).send(stationList);
        })
        .catch(next);
});

app.use((err, req, res, next) => {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("internal server error");
});

app.listen(3000, function() {
    console.log("Example app listening on port 3000!");
});
