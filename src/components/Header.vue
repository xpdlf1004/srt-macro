<template>
  <b-navbar class="header" toggleable="md" type="dark">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="#">
      <router-link to="/">SRT 매크로</router-link>
    </b-navbar-brand>

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item href="#">
          <router-link to="/">일정</router-link>
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#">
          <router-link to="/login">로그아웃</router-link>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Header extends Vue {}
</script>

<style lang="scss" scoped>
.header {
  background-color: #4e2f49;
  color: white;
  height: 45px;
  a {
    color: inherit;
    &:hover {
      text-decoration: none;
    }
  }
  .nav-item {
    a {
      &.router-link-exact-active {
        color: white;
      }
    }
  }
}
</style>
