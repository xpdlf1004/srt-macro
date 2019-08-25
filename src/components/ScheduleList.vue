<template>
  <div>
    <div class="schedule-item-cont">
      <ScheduleItem
        class="schedule-item"
        v-for="schedule in $store.getters.schedules"
        :schedule="schedule"
        :key="schedule.id"
      />
      <router-link to="/schedule/add">
        <div
          class="add-btn align-items-center justify-content-center schedule-item"
        >
          <font-awesome-icon icon="plus" class="mr-1" />일정 추가
        </div>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ScheduleItem from "@/components/ScheduleItem.vue";
import { Schedule } from "../../common/schedule";

@Component({
  components: {
    ScheduleItem
  }
})
export default class ScheduleList extends Vue {}
</script>
<style lang="scss" scoped>
.title-cont {
  margin-bottom: 20px;
}

.add-btn {
  display: inline-flex;
  vertical-align: top;
  width: 250px;
  height: 130px;
  border-radius: 6px;
  background-color: $primary-color;
  color: white;
  cursor: pointer;
}

.schedule-item-cont {
  margin: 0 -8px 0 -8px;
}

.schedule-item {
  margin: 0 8px 16px 8px;
}
</style>
