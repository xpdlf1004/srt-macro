<template>
  <div>
    <div class="title-cont">
      <h5>결제 대기중 일정</h5>
    </div>
    <div>
      <ScheduleItem/>
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
.title-cont {
  margin-bottom: 20px;
}
</style>