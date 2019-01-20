<template>
  <div>
    <div class="title-cont">
      <h5>등록된 일정</h5>
    </div>
    <div>
      <ScheduleItem/>
      <div class="add-btn align-items-center justify-content-center">
        <font-awesome-icon icon="plus" class="mr-1"/>일정 추가
      </div>
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
export default class scheduleList extends Vue {}
</script>
<style ang="scss" scoped>
.title-cont {
  margin-bottom: 20px;
}

.add-btn {
  display: inline-flex;
  width: 250px;
  height: 100px;
  border-radius: 10px;
  background-color: rgb(201, 163, 194);
  color: white;
  cursor: pointer;
}
</style>