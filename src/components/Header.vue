<template>
  <div class="header d-flex align-items-center">
    <div class="brand">
      <router-link to="/">SRT 매크로</router-link>
    </div>
    <div>
      <router-link to="/schedule">내 일정</router-link>
    </div>
    <div class="ml-auto">
      <router-link to="/login">로그아웃</router-link>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Header extends Vue {}
</script>

<style lang="scss" scoped>
.header {
  padding: 0 24px 0 24px;
  background-color: #4e2f49;
  color: white;
  height: 45px;
  a {
    color: inherit;
    &:hover {
      text-decoration: none;
    }
  }
  .brand {
    margin-right: 60px;
    font-weight: bold;
  }
  .nav-item {
    a {
      color: white;
    }
  }
}
</style>
