<template>
  <div>
    <div class="section">
      <div class="title-cont">
        <h5>등록된 일정</h5>
      </div>
      <ScheduleList />
    </div>
    <div class="section">
      <div class="title-cont">
        <h5>결제 대기중 일정</h5>
      </div>
      <WaitPaymentList />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ScheduleList from "@/components/ScheduleList.vue";
import WaitPaymentList from "@/components/WaitPaymentList.vue";

@Component({
  components: {
    ScheduleList,
    WaitPaymentList
  }
})
export default class AddSchedule extends Vue {}
</script>
<style lang="scss" scoped></style>
