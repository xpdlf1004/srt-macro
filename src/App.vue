<template>
  <div id="app">
    <Header v-if="$store.state.isAuthenticated" />
    <router-view />
  </div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import * as APIClient from "./api-client";
import { Schedule } from "common/schedule";
import moment from "moment";
import * as Noti from "./notification";

@Component({
  components: {
    Header
  }
})
export default class App extends Vue {
  worker: any;
  mounted() {
    Noti.initNotify();
    console.info("Start macro worker!");
    let working = false;
    this.worker = setInterval(async () => {
      if (working) {
        return;
      }
      if (!this.$store.state.isAuthenticated) {
        return;
      }

      const waitPaymentSchedules: Schedule[] = this.$store.getters
        .waitPaymentSchedules;
      const currentUnix = moment().unix();
      waitPaymentSchedules.forEach(schedule => {
        if (schedule.ticketingExpiredTime! < currentUnix) {
          schedule.ticketingExpiredTime = undefined;
          schedule.status = "running";
          this.$store.commit("UPDATE_SCHEDULE", schedule);
          console.info("결제기한이 만료되어 일정으로 추가합니다.");
        }
      });

      const schedules: Schedule[] = this.$store.getters.schedules;
      if (schedules.length === 0) {
        return;
      }
      console.info(`${schedules.length}개의 일정을 조회합니다.`);
      await schedules.reduce((chain, schedule) => {
        return chain.then(async () => {
          console.log(schedule.date);
          try {
            const response = await APIClient.reserveTrain({
              startTime: schedule.startTime,
              startPoint: schedule.startPoint,
              destPoint: schedule.destPoint,
              date: schedule.date,
              seatType: schedule.seatType,
              trainId: schedule.trainId,
              childCount: schedule.childCount,
              adultCount: schedule.adultCount
            });
            if (response === "ok") {
              console.log("티켓 예약 완료!");
              Noti.notifyMe(
                `${schedule.date} ${schedule.startTime} 열차 예약 성공 20분안에 결제하세요.`
              );
              schedule.ticketingExpiredTime = moment()
                .add(20, "minute")
                .unix();
              schedule.status = "waitForPay";
              this.$store.commit("UPDATE_SCHEDULE", schedule);
            } else if (response === "full") {
              console.log("좌석 없음");
            } else {
              console.error(response);
              schedule.error = "response";
              this.$store.commit("UPDATE_SCHEDULE", schedule);
            }
          } catch (e) {
            console.error(e);
            this.$toasted.show(
              "세션이 만료 되었습니다. 다시 로그인 해주세요.",
              {
                theme: "outline",
                position: "bottom-center",
                duration: 3000
              }
            );
            this.$store.commit("LOGOUT");
            this.$router.push("/login");
          }
        });
      }, Promise.resolve());
      working = false;
    }, 2000);
  }
  destoryed() {
    console.info("Finish macro worker..");
    clearInterval(this.worker);
  }
}
</script>

<style lang="scss">
html,
body {
  min-width: 1024px;
}

.page {
  max-width: 1024px;
  margin: 0 auto;
  padding: 60px 0 60px 0;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
