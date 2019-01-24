<template>
  <div>
    <div class="section">
      <div class="title-cont">
        <h5>일정 등록</h5>
      </div>
      <div class="filter-input-cont">
        <b-form>
          <div class="d-inline-block mr-3">
            <b-form-select
              :options="stations"
              required
              v-model="form.startPoint"
              class="station-select mr-3"
            ></b-form-select>
            <font-awesome-icon icon="exchange-alt"/>
            <b-form-select
              :options="stations"
              required
              v-model="form.destPoint"
              class="station-select ml-3"
            ></b-form-select>
          </div>
          <div class="d-inline-block mr-3">
            <b-form-select :options="dateOptions" required v-model="form.date" class="date-select"></b-form-select>
          </div>
          <div class="d-inline-block">
            <b-form-select
              :options="startTimeOptions"
              required
              v-model="form.startTime"
              class="time-select"
            ></b-form-select>
            <span class="time-label ml-2">시</span>
          </div>
        </b-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import _ from "lodash";
moment.locale("ko", {
  weekdays: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일"
  ],
  weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"]
});

@Component({
  components: {}
})
export default class AddSchedule extends Vue {
  form = {
    startPoint: null,
    destPoint: null,
    date: moment().format("YYYY/MM/DD (ddd)"),
    startTime: Math.floor(Number(moment().format("HH")) / 2) * 2,
    adultCount: null,
    childCount: null
  };
  stations = [{ text: "Select One", value: null }];
  startTimeOptions = _.map(_.range(12), index =>
    moment()
      .startOf("date")
      .add(index * 2, "hours")
      .format("HH")
  );
  dateOptions = _.map(_.range(30), index =>
    moment()
      .startOf("date")
      .add(index, "day")
      .format("YYYY/MM/DD (ddd)")
  );
  mounted() {}
}
</script>
<style lang="scss" scoped>
.filter-input-cont {
  border: 1px solid $primary-color;
  padding: 24px 24px 24px 24px;

  .station-select {
    width: 200px;
  }
  .time-select {
    width: 80px;
  }
  .date-select {
    width: 200px;
  }
}
</style>

