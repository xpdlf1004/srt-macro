<template>
  <div class="schedule-item">
    <div class="start-dest-cont">
      <span class="mr-2">{{ schedule.startPoint }}</span>
      <font-awesome-icon icon="arrow-right"/>
      <span class="ml-2">{{ schedule.destPoint }}</span>
    </div>
    <div class="schedule-info-cont">
      <div>
        <span>출발 {{ startTimeLabel }}</span>
      </div>
      <div>
        <span>도착 {{ destTimeLabel }}</span>
      </div>
      <div>
        <span>{{ seatInfoLabel }}</span>
      </div>
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

  get startTimeLabel() {
    return moment(this.schedule.startTime).format("HH:mm");
  }

  get destTimeLabel() {
    return moment(this.schedule.destTime).format("HH:mm");
  }

  get seatInfoLabel() {
    return `${this.schedule.seatType === "normal" ? "일반실" : "특실"} ${
      this.schedule.quantity
    }명`;
  }
}
</script>
<style lang="scss" scoped>
.schedule-item {
  display: inline-block;
  width: 250px;
  border: 1px solid $primary-color;
  border-radius: 8px;
  padding: 12px;
  vertical-align: top;

  .start-dest-cont {
    margin-bottom: 8px;
    span {
      font-weight: bold;
    }
  }
  .schedule-info-cont {
    font-size: 0.75rem;
  }
}
</style>
