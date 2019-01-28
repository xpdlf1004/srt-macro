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
      <div class="loader" />
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
    bottom: 6px;
  }
}
</style>
