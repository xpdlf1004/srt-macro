<template>
  <div class="home">
    <b-container>
      <div class="section">
        <ScheduleList/>
      </div>
      <div class="section">
        <WaitPaymentList/>
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
import ScheduleList from "@/components/ScheduleList.vue";
import WaitPaymentList from "@/components/WaitPaymentList.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    ScheduleList,
    WaitPaymentList
  }
})
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
.home {
  padding-top: 60px;
  .section {
    margin-bottom: 60px;
  }
}
</style>

