<template>
  <div class="Add-schedule-table">
    <div class="table-header">수서 -> 부산</div>
    <b-table :items="trains" :fields="fields">
      <template slot="start" slot-scope="data">{{`${data.item.startPoint} ${data.item.startTime}`}}</template>
      <template slot="dest" slot-scope="data">{{`${data.item.destPoint} ${data.item.destTime}`}}</template>
      <template slot="special" slot-scope="data">
        <b-button variant="primary">일정등록</b-button>
      </template>
      <template slot="normal" slot-scope="data">
        <b-button variant="primary">일정등록</b-button>
      </template>
    </b-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class AddScheduleTable extends Vue {
  @Prop() trains: any;
  fields = [
    {
      key: "start",
      label: "출발시간",
      class: "text-center custom"
    },
    {
      key: "dest",
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
      button {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
