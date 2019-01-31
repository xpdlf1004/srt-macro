<template>
  <b-form @submit="handleOnSubmit">
    <div class="filter-input-cont">
      <div>
        <div class="d-inline-block mr-3">
          <b-form-select
            :options="stations"
            required
            v-model="form.startPoint"
            class="large-select mr-3"
          ></b-form-select>
          <font-awesome-icon icon="exchange-alt" class="change-icon" @click="onChangePoint"/>
          <b-form-select
            :options="stations"
            required
            v-model="form.destPoint"
            class="large-select ml-3"
          ></b-form-select>
        </div>
        <div class="d-inline-block mr-3">
          <b-form-select :options="dateOptions" required v-model="form.date" class="large-select"></b-form-select>
        </div>
        <div class="d-inline-block">
          <b-form-select
            :options="startTimeOptions"
            required
            v-model="form.startTime"
            class="small-select"
          ></b-form-select>
          <span class="time-label ml-2 align-middle">시</span>
        </div>
      </div>
      <div class="mt-4" v-if="false">
        <div class="d-inline-block">
          <span class="align-middle mr-2">어른</span>
          <b-form-select
            :options="peopleOptions"
            required
            v-model="form.adultCount"
            class="small-select"
          ></b-form-select>
        </div>
        <div class="d-inline-block ml-3">
          <span class="align-middle mr-2">어린이</span>
          <b-form-select
            :options="peopleOptions"
            required
            v-model="form.childCount"
            class="small-select"
          ></b-form-select>
        </div>
      </div>
    </div>
    <div class="text-center mt-3">
      <b-button type="submit" variant="primary" class="submit-btn">조회하기</b-button>
    </div>
  </b-form>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment";
import _ from "lodash";
import * as Station from "../../common/station";

@Component({
  components: {}
})
export default class AddScheduleForm extends Vue {
  @Prop() onSubmit!: (data: any) => void;
  form = {
    startPoint: _.find(Station.stations, station => station.text === "수서")!
      .value,
    destPoint: _.find(Station.stations, station => station.text === "부산")!
      .value,
    date: moment().format("YYYY/MM/DD (ddd)"),
    startTime: Math.floor(moment().get("hour") / 2) * 2,
    adultCount: 1,
    childCount: 0
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
  peopleOptions = [0, 1, 2, 3, 4];
  onChangePoint() {
    const startPoint = this.form.startPoint;
    this.form.startPoint = this.form.destPoint;
    this.form.destPoint = startPoint;
  }
  handleOnSubmit(evt: any) {
    evt.preventDefault();
    this.$emit("onSubmit", {
      startPoint: this.form.startPoint,
      destPoint: this.form.destPoint,
      date: this.form.date,
      startTime: this.form.startTime,
      adultCount: this.form.adultCount,
      childCount: this.form.childCount
    });
  }
}
</script>
<style lang="scss" scoped>
.filter-input-cont {
  border: 1px solid $primary-color;
  padding: 36px 36px 36px 36px;

  .large-select {
    width: 180px;
  }
  .small-select {
    width: 80px;
  }
  .change-icon {
    cursor: pointer;
  }
}

.submit-btn {
  width: 200px;
}
</style>
