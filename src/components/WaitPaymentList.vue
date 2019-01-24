<template>
  <div>
    <div>
      <span>결제 대기중인 일정이 없습니다.</span>
    </div>
  </div>
</template>
<script lang="ts">
import ScheduleItem from "@/components/ScheduleItem.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

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
