<template>
  <div id="app">
    <m-header v-show="isHeaderShow"></m-header>
    <!-- 路由 -->

    <router-view></router-view>

    <music-player></music-player>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from "@/components/m-header/m-header";
import player from "@/views/player/player";

export default {
  data() {
    return {};
  },
  components: {
    "m-header": Header,
    "music-player": player
  },
  computed: {
    ...mapState(["isHeaderShow", "playlist"])
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $font-color-f;
  user-select: none;
  height: 100vh;
}
</style>
