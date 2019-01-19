var express = require("express");
var bodyParser = require("body-parser");
var axios = require("axios");
var qs = require("qs");
var session = require("express-session");
var cheerio = require("cheerio");
var morgan = require("morgan");
var cors = require("cors");

var app = express();

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

app.post("/login", function(req, res) {
  axios
    .post(
      "https://etk.srail.co.kr/cmc/01/selectLoginInfo.do?pageId=TK0701000000",
      qs.stringify({
        srchDvNm: req.body.userNumber,
        hmpgPwdCphd: req.body.userPassword,
        srchDvCd: "1"
      })
    )
    .then(function(response) {
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
          sessionKey = response.headers["set-cookie"][1]
            .split(";")[0]
            .split("JSESSIONID_ETK=")[1];
          req.session.JSESSIONID_ETK = sessionKey;
          req.session.expires = false;
        }
        res.status(200).send("success");
      } else {
        res.status(500).send("invalid id or password");
      }
    })
    .catch(function(error) {
      res.status(500).send("server error");
    });
});

app.post("/kakaoLogin", function(req, res) {
  var accessToken = req.body.accessToken;
  var refreshToken = req.body.refreshToken;
  var expiresIn = req.body.expiresIn;
  req.session.KAKAO_ACCESS_KEY = accessToken;
  req.session.KAKAO_REFRESH_KEY = refreshToken;
  req.session.KAKAO_EXPIRED = new Date().getTime() + expiresIn * 1000;
  res.status(200).send("ok");
});

app.post("/kakaoMessage", function(req, res) {
  function requestToken(refreshToken) {
    return axios.post(
      "https://kauth.kakao.com/oauth/token",
      qs.stringify({
        grant_type: "refresh_token",
        client_id: "9dd44b130e742747765bbf2ebf62e405",
        refresh_token: refreshToken
      })
    );
  }

  function sendMessageWithToken(accessToken) {
    return axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      qs.stringify({
        template_object: JSON.stringify({
          object_type: "text",
          text: "SRT 메크로 예약 성공!! 10분안에 결제 하세요.",
          button_title: "결제 하기",
          link: {
            web_url:
              "https://etk.srail.co.kr/hpg/hra/02/selectReservationList.do?pageId=TK0102010000",
            mobile_web_url:
              "https://etk.srail.co.kr/hpg/hra/02/selectReservationList.do?pageId=TK0102010000"
          }
        })
      }),
      {
        headers: {
          Authorization: "Bearer " + accessToken
        }
      }
    );
  }

  async function sendMessage() {
    var expiredTime = req.session.KAKAO_EXPIRED;
    var currentTime = new Date().getTime();
    var refreshToken = req.session.KAKAO_REFRESH_KEY;

    try {
      if (currentTime > expiredTime) {
        var requestTokenResponse = await requestToken(refreshToken);
        var responseData = requestTokenResponse.data;
        req.session.KAKAO_ACCESS_KEY = responseData["access_token"];
        req.session.KAKAO_EXPIRED =
          new Date().getTime() + responseData["expires_in"] * 1000;
      }
      var accessToken = req.session.KAKAO_ACCESS_KEY;
      var sendMessageWithTokenResponse = await sendMessageWithToken(
        accessToken
      );
      res.status(200).send("success");
    } catch (e) {
      res.status(500).send("send message fail");
    }
  }

  if (!req.session.KAKAO_ACCESS_KEY) {
    res.status(500).send("not logged in");
    return;
  }
  sendMessage();
});

app.get("/trainList", function(req, res) {
  var startStation = req.query.startStation;
  var startStationNumber = req.query.startStationNumber;
  var endStation = req.query.endStation;
  var endStationNumber = req.query.endStationNumber;
  var requestDate = req.query.requestDate;
  var requestTime = req.query.requestTime;
  axios
    .post(
      "https://etk.srail.co.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000",
      qs.stringify({
        dptRsStnCd: startStationNumber,
        arvRsStnCd: endStationNumber,
        stlbTrnClsfCd: "05",
        psgNum: "1",
        seatAttCd: "015",
        isRequest: "Y",
        dptRsStnCdNm: startStation,
        arvRsStnCdNm: endStation,
        dptDt: requestDate,
        dptTm: requestTime + "00",
        chtnDvCd: "1",
        psgInfoPerPrnb1: "1",
        psgInfoPerPrnb5: "0",
        psgInfoPerPrnb4: "0",
        psgInfoPerPrnb2: "0",
        psgInfoPerPrnb3: "0",
        locSeatAttCd1: "000",
        rqSeatAttCd1: "015",
        trnGpCd: "300"
      })
    )
    .then(function(response) {
      var $ = cheerio.load(response.data);
      trainList = [];
      $("#result-form table tbody tr").each(function(trIndex, trElem) {
        tdElem = $(trElem).find("td");
        if (tdElem.length == 11) {
          var trainNumber = $(tdElem[2])
            .text()
            .trim();
          var startTime = $(tdElem[3])
            .text()
            .trim();
          var endTime = $(tdElem[4])
            .text()
            .trim();
          // var canSpecialSeat = $(tdElem[5]).text().trim().includes('예약하기');
          // var canCommonSeat = $(tdElem[6]).text().trim().includes('예약하기');
          var duration = $(tdElem[10])
            .text()
            .trim();
          trainInfo = {
            trainNumber: trainNumber,
            startTime: startTime,
            endTime: endTime,
            duration: duration
          };
          trainList.push(trainInfo);
        }
      });
      res.status(200).send(trainList);
    })
    .catch(function(error) {
      res.status(500).send("server error");
    });
});

app.post("/checkLogin", function(req, res) {
  if (req.session.JSESSIONID_ETK) {
    res.status(200).send("logged in");
  } else {
    res.status(500).send("not logged in");
  }
});

app.post("/logout", function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      res.status(500).send("server error");
    } else {
      res.status(200).send("loggout");
    }
  });
});

app.post("/reserveTrain", function(req, res) {
  function checkUserInfo(
    startDate,
    startTime,
    trainNumber,
    startStation,
    endStation,
    seatType
  ) {
    return axios.post(
      "https://etk.srail.co.kr/hpg/hra/01/checkUserInfo.do?pageId=TK0101010000",
      qs.stringify({
        rsvTpCd: "01",
        jobId: "1101",
        jrnyTpCd: "11",
        jrnyCnt: "1",
        totPrnb: "1",
        stndFlg: "N",
        //trnOrdrNo1: '1', // 기차 순번 Optional
        jrnySqno1: "001",
        runDt1: startDate, //출발 날짜 ex) 20180212
        trnNo1: trainNumber, // 기차번호 ex) 00339
        trnGpCd1: "300",
        stlbTrnClsfCd1: "17",
        dptDt1: startDate, // 출발 날짜 ex) 20180212
        dptTm1: startTime, // 출발 시간 ex) 144600
        dptRsStnCd1: startStation, // 출발역 ex) 0010
        //dptStnConsOrdr1: '000001',// 출발역 Optional
        //dptStnRunOrdr1: '000001',// 출발역 Optional
        arvRsStnCd1: endStation, // 도착역 ex) 0020
        //arvStnConsOrdr1: '000020',// 도착역 Optional
        //arvStnRunOrdr1: '000006',// 도착역 Optional
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
        psrmClCd1: seatType, // 일반 1, 특실 2
        smkSeatAttCd1: "000",
        dirSeatAttCd1: "000",
        locSeatAttCd1: "000",
        rqSeatAttCd1: "015",
        etcSeatAttCd1: "000",
        psgGridcnt: "1",
        psgTpCd1: "1",
        psgInfoPerPrnb1: "1",
        psgTpCd2: "",
        psgInfoPerPrnb2: "",
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
          Cookie: "JSESSIONID_ETK=" + req.session.JSESSIONID_ETK
        }
      }
    );
  }

  function requestReservationInfo() {
    return axios.get(
      "https://etk.srail.co.kr/hpg/hra/02/requestReservationInfo.do?pageId=TK0101030000",
      {
        headers: {
          Cookie: "JSESSIONID_ETK=" + req.session.JSESSIONID_ETK
        }
      }
    );
  }

  function confirmReservationInfo() {
    return axios.get(
      "https://etk.srail.co.kr/hpg/hra/02/confirmReservationInfo.do?pageId=TK0101030000",
      {
        headers: {
          Cookie: "JSESSIONID_ETK=" + req.session.JSESSIONID_ETK
        }
      }
    );
  }

  async function reserveTrain(
    startDate,
    startTime,
    trainNumber,
    startStation,
    endStation,
    seatType
  ) {
    try {
      const checkUserInfoResponse = await checkUserInfo(
        startDate,
        startTime,
        trainNumber,
        startStation,
        endStation,
        seatType
      );
      if (checkUserInfoResponse.data.includes("selectLoginForm.do")) {
        res.status(500).send("invalid token");
        return;
      }
      const requestReservationInfoResponse = await requestReservationInfo();
      const confirmReservationInfoResponse = await confirmReservationInfo();
      if (confirmReservationInfoResponse.data.includes("잔여석없음")) {
        res.status(200).send("full");
      } else if (
        confirmReservationInfoResponse.data.includes("열차구간정보오류")
      ) {
        res.status(500).send("invalid param");
      } else if (
        confirmReservationInfoResponse.data.includes(
          "20분 이내 열차는 예약하실 수 없습니다."
        )
      ) {
        res.status(500).send("invalid time");
      } else if (
        confirmReservationInfoResponse.data.includes(
          "10분 내에 결제하지 않으면 예약이 취소됩니다."
        )
      ) {
        res.status(200).send("ok");
      } else if (
        confirmReservationInfoResponse.data.includes(
          "입력하신 값을 다시 확인하여 주시기 바랍니다."
        )
      ) {
        res.status(500).send("unknown error");
      } else {
        console.log(confirmReservationInfoResponse.data);
        res.status(500).send("server error");
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("external server error");
    }
  }

  if (!req.session.JSESSIONID_ETK) {
    res.status(500).send("invalid token");
    return;
  }
  var startDate = req.body.startDate;
  var startTime = req.body.startTime;
  var trainNumber = req.body.trainNumber;
  var startStation = req.body.startStation;
  var endStation = req.body.endStation;
  var seatType = req.body.seatType;
  reserveTrain(
    startDate,
    startTime,
    trainNumber,
    startStation,
    endStation,
    seatType
  );
});

app.get("/stationList", function(req, res) {
  axios
    .post(
      "https://etk.srail.co.kr/hpg/hra/01/selectMapInfo.do?isAll=Y&other=&target=dpt&pageId=TK0101010000"
    )
    .then(function(response) {
      var $ = cheerio.load(response.data);
      var stationList = [];
      $("#wrap .map>ul>li").each(function(index, elem) {
        $(elem)
          .find("ul li")
          .each(function(i, e) {
            var aTag = $(e).find("a");
            if (aTag.length > 0) {
              var clickEvent = $(aTag[0])
                .attr("onclick")
                .split("'");
              var id = clickEvent[1];
              var name = clickEvent[3];
              stationList.push({
                id: id,
                name: name
              });
            }
          });
      });
      res.status(200).send(stationList);
    })
    .catch(function(error) {
      res.status(500).send("server error");
    });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
