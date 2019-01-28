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
    this.worker = setInterval(() => {
      if (!this.$store.state.isAuthenticated) {
        return;
      }
      const schedules: Schedule[] = this.$store.state.schedules;
      if (schedules.length === 0) {
        return;
      }
      console.info(`${schedules.length}개의 일정을 조회합니다.`);

      APIClient.reserveTrain({
        startTime: schedules[0].startTime,
        startPoint: schedules[0].startPoint,
        destPoint: schedules[0].destPoint,
        date: schedules[0].date,
        seatType: schedules[0].seatType,
        trainId: schedules[0].trainId
      })
        .then(response => console.log(response))
        .catch(e => console.error(e));
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
