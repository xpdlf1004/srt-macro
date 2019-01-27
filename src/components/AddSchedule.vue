<template>
  <div>
    <div class="section">
      <div class="title-cont">
        <h5>일정 등록</h5>
      </div>
      <AddScheduleForm @onSubmit="onSubmit"/>
      <div class="schedule-table-cont">
        <AddScheduleTable :trains="trains"/>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment from "moment";
import _ from "lodash";
import * as Station from "../../common/station";
import AddScheduleForm from "./AddScheduleForm.vue";
import AddScheduleTable from "./AddScheduleTable.vue";
import * as APIClient from "../api-client";

@Component({
  components: {
    AddScheduleForm,
    AddScheduleTable
  }
})
export default class AddSchedule extends Vue {
  trains = [
    {
      startTime: "08:00",
      startPoint: "서울",
      destTime: "10:20",
      destPoint: "수서"
    },
    {
      startTime: "08:00",
      startPoint: "서울",
      destTime: "10:20",
      destPoint: "수서"
    },
    {
      startTime: "08:00",
      startPoint: "서울",
      destTime: "10:20",
      destPoint: "수서"
    }
  ];

  onSubmit(data: {
    startPoint: string;
    destPoint: string;
    date: string;
    startTime: string;
    adultCount: number;
    cildCount: number;
  }) {
    APIClient.getTrains({
      startStation: data.startPoint,
      destStation: data.destPoint,
      requestDate: moment(data.date).format("YYYYMMDD"),
      requestTime: data.startTime
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
</script>
<style lang="scss" scoped>
.schedule-table-cont {
  margin-top: 30px;
}
</style>

