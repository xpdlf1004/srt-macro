<template>
  <div class="Add-schedule-table">
    <div class="table-header">
      {{ startStation }}
      <font-awesome-icon icon="arrow-right" />
      {{ destStation }}<span class="mr-3" />{{ selectedDate }}
    </div>
    <b-table :items="trains" :fields="fields">
      <template slot="startTime" slot-scope="data"
        >{{ startStation }}<br />{{ data.item.startTime }}</template
      >
      <template slot="destTime" slot-scope="data"
        >{{ destStation }}<br />{{ data.item.destTime }}</template
      >
      <template slot="special" slot-scope="data">
        <b-button variant="primary" @click="handleAddSeat(data.item, 'special')"
          >일정등록</b-button
        >
      </template>
      <template slot="normal" slot-scope="data">
        <b-button variant="primary" @click="handleAddSeat(data.item, 'normal')"
          >일정등록</b-button
        >
      </template>
    </b-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Train } from "../../common/train";
import * as Station from "../../common/station";
import moment from "moment";
import * as _ from "lodash";
import { Schedule } from "../../common/schedule";
import uuid from "uuid/v1";

@Component({
  components: {}
})
export default class AddScheduleTable extends Vue {
  @Prop() trains!: Train[];
  @Prop() selectedFormData!: {
    startPoint: string;
    destPoint: string;
    date: string;
    startTime: string;
    adultCount: number;
    childCount: number;
  };
  fields = [
    {
      key: "startTime",
      label: "출발시간",
      class: "text-center custom"
    },
    {
      key: "destTime",
      label: "도착시간",
      class: "text-center"
    },
    {
      key: "special",
      label: "특실",
      class: "text-center"
    },
    {
      key: "normal",
      label: "일반실",
      class: "text-center"
    }
  ];
  handleAddSeat(data: Train, seatType: "normal" | "special") {
    const newSchedule: Schedule = {
      id: uuid(),
      startPoint: this.selectedFormData.startPoint,
      startStation: this.startStation,
      destPoint: this.selectedFormData.destPoint,
      destStation: this.destStation,
      date: this.selectedFormData.date,
      startTime: data.startTime,
      destTime: data.destTime,
      seatType,
      adultCount: this.selectedFormData.adultCount,
      childCount: this.selectedFormData.childCount,
      status: "running",
      trainId: data.trainId
    };
    this.$store.commit("UPDATE_SCHEDULE", newSchedule);
    this.$toasted.show("새로운 일정이 등록되었습니다.", {
      theme: "outline",
      position: "bottom-center",
      duration: 2000
    });
  }
  get startStation() {
    const station = Station.stations.find(
      s => s.value === this.selectedFormData.startPoint
    );
    return station!.text;
  }
  get destStation() {
    const station = Station.stations.find(
      s => s.value === this.selectedFormData.destPoint
    );
    return station!.text;
  }
  get selectedDate() {
    return moment(this.selectedFormData.date).format("YYYY년 MM월 DD일 (ddd)");
  }
}
</script>
<style lang="scss">
// tdClass is not working on the scoped css
.Add-schedule-table {
  .table-header {
    padding: 12px 24px 12px 24px;
    border: 1px solid $primary-color;
  }
  table {
    border: 1px solid $primary-color;
    border-top: none;
    th {
      border: 1px solid $primary-color;
      border-top: none;
    }
    td {
      border: 1px solid $primary-color;
      vertical-align: middle;
      font-size: 0.8rem;
      padding: 8px;
      button {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
