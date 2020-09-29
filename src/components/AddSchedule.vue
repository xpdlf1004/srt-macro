<template>
  <div>
    <div class="section">
      <div class="title-cont">
        <h5>일정 등록</h5>
      </div>
      <AddScheduleForm @onSubmit="onSubmit" />
      <div class="schedule-table-cont" v-if="trains && selectedFormData">
        <AddScheduleTable
          :trains="trains"
          :selectedFormData="selectedFormData"
        />
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
import { Train } from "../../common/train";

@Component({
  components: {
    AddScheduleForm,
    AddScheduleTable
  }
})
export default class AddSchedule extends Vue {
  trains: Train[] | null = null;
  selectedFormData: {
    startPoint: string;
    destPoint: string;
    date: string;
    startTime: string;
    adultCount: number;
    childCount: number;
  } | null = null;

  onSubmit(data: {
    startPoint: string;
    destPoint: string;
    date: string;
    startTime: string;
    adultCount: number;
    childCount: number;
  }) {
    this.selectedFormData = data;

    APIClient.getTrains({
      startStation: data.startPoint,
      destStation: data.destPoint,
      requestDate: moment(data.date).format("YYYYMMDD"),
      requestTime: data.startTime
    })
      .then(response => {
        this.trains = response.data;
      })
      .catch(error => {
        console.error(error);
      });
  }
}
</script>
<style lang="scss" scoped>
.schedule-table-cont {
  margin-top: 60px;
}
</style>
