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

@Component({
  components: {
    Header
  }
})
export default class App extends Vue {
  worker: any;
  mounted() {
    console.info("Start macro worker!");
    let working = false;
    this.worker = setInterval(async () => {
      if (working) {
        return;
      }
      if (!this.$store.state.isAuthenticated) {
        return;
      }
      const schedules: Schedule[] = this.$store.getters.schedules;
      if (schedules.length === 0) {
        return;
      }
      console.info(`${schedules.length}개의 일정을 조회합니다.`);
      await schedules.reduce(async (chain, schedule) => {
        try {
          const response = await APIClient.reserveTrain({
            startTime: schedule.startTime,
            startPoint: schedule.startPoint,
            destPoint: schedule.destPoint,
            date: schedule.date,
            seatType: schedule.seatType,
            trainId: schedule.trainId
          });
          if (response === "ok") {
            console.log("티켓 예약 완료!");
            schedule.ticketingTimestamp = +new Date();
            schedule.status = "waitForPay";
            this.$store.commit("UPDATE_SCHEDULE", schedule);
          } else {
            console.log(response);
          }
        } catch (e) {
          console.error(e);
        }
      }, Promise.resolve());
      working = false;
    }, 5000);
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
