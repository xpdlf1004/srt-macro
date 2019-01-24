<template>
  <div id="app">
    <Header v-if="$store.state.isAuthenticated"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    Header
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
html,
body {
  min-width: 1024px;
}

.page {
  max-width: 1024px;
  margin: 0 auto;
  padding: 60px 0 60px 0;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
