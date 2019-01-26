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
            <font-awesome-icon icon="exchange-alt" />
            <b-form-select
              :options="stations"
              required
              v-model="form.destPoint"
              class="station-select ml-3"
            ></b-form-select>
          </div>
          <div class="d-inline-block mr-3">
            <b-form-select
              :options="dateOptions"
              required
              v-model="form.date"
              class="date-select"
            ></b-form-select>
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
import * as Station from "../../common/station";

@Component({
  components: {}
})
export default class AddSchedule extends Vue {
  form = {
    startPoint: _.find(Station.stations, station => station.text === "수서")!
      .value,
    destPoint: _.find(Station.stations, station => station.text === "부산")!
      .value,
    date: moment().format("YYYY/MM/DD (ddd)"),
    startTime: Math.floor(moment().get("hour") / 2) * 2,
    adultCount: null,
    childCount: null
  };
  stations = Station.stations;
  startTimeOptions = _.map(_.range(12), index => {
    const date = moment()
      .startOf("date")
      .add(index * 2, "hours");
    return {
      value: date.get("hour"),
      text: date.format("HH")
    };
  });
  dateOptions = _.map(_.range(30), index =>
    moment()
      .startOf("date")
      .add(index, "day")
      .format("YYYY/MM/DD (ddd)")
  );
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

