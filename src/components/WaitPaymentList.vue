<template>
  <div>
    <div class="schedule-item-cont">
      <ScheduleItem
        class="schedule-item"
        v-for="waitPaymentSchedule in $store.getters.waitPaymentSchedules"
        :schedule="waitPaymentSchedule"
        :key="waitPaymentSchedule.id"
      />
      <span
        v-if="$store.getters.waitPaymentSchedules.length === 0"
        class="schedule-item"
        >결제 대기중인 일정이 없습니다.</span
      >
    </div>
  </div>
</template>
<script lang="ts">
import ScheduleItem from "@/components/ScheduleItem.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Schedule } from "../../common/schedule";

@Component({
  components: {
    ScheduleItem
  }
})
export default class WaitPaymentList extends Vue {}
</script>
<style ang="scss" scoped>
.schedule-item-cont {
  margin: 0 -8px 0 -8px;
}

.schedule-item {
  margin: 0 8px 16px 8px;
}
</style>
