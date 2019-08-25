<template>
  <div class="schedule-item">
    <div class="start-dest-cont">
      <span class="mr-2">{{ schedule.startStation }}</span>
      <font-awesome-icon icon="arrow-right" />
      <span class="ml-2">{{ schedule.destStation }}</span>
    </div>
    <div class="schedule-info-cont">
      <div>
        <span>{{ schedule.date }}</span>
      </div>
      <div>
        <span>출발 {{ schedule.startTime }}</span>
      </div>
      <div>
        <span>도착 {{ schedule.destTime }}</span>
      </div>
      <div>
        <span>{{ seatInfoLabel }}</span>
      </div>
    </div>
    <div class="right-bottom">
      <a
        v-if="schedule.status === 'waitForPay'"
        href="https://etk.srail.co.kr/hpg/hra/02/selectReservationList.do?pageId=TK0102010000"
        target="_blank"
      >
        <div class="text-right">
          <span>{{ remainingTime }} 까지</span><br /><span>결제하기</span>
        </div>
      </a>
      <div v-else-if="schedule.status === 'running'" class="loader" />
      <span class="error-text" v-else>{{ schedule.error || "에러" }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import moment from "moment";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Schedule } from "../../common/schedule";

@Component
export default class ScheduleItem extends Vue {
  @Prop() private schedule!: Schedule;

  get seatInfoLabel() {
    return `${this.schedule.seatType === "normal" ? "일반실" : "특실"} ${this
      .schedule.adultCount + this.schedule.childCount}명`;
  }

  get remainingTime() {
    return moment.unix(this.schedule.ticketingExpiredTime!).format("HH:mm");
  }
}
</script>
<style lang="scss" scoped>
.schedule-item {
  display: inline-block;
  width: 250px;
  border: 1px solid $primary-color;
  border-radius: 6px;
  padding: 12px;
  vertical-align: top;
  position: relative;

  .start-dest-cont {
    margin-bottom: 8px;
    span {
      font-weight: bold;
    }
  }
  .schedule-info-cont {
    font-size: 0.75rem;
  }
  .right-bottom {
    position: absolute;
    right: 12px;
    bottom: 8px;
    font-size: 0.8rem;
  }
  .error-text {
    font-size: 0.8rem;
  }
}
</style>
