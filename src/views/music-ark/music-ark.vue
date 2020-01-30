<template>
  <div class="music-ark">
    <nav>
      <router-link v-for="item in routerItem" :key="item.id" :to="item.url" tag="div">{{item.txt}}</router-link>
    </nav>
    <!-- 二级路由 -->

    <transition name="fade">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      routerItem: [
        {
          id: 0,
          url: "/music-ark/rank",
          txt: "排行"
        },
        {
          id: 1,
          url: "/music-ark/recommend",
          txt: "推荐"
        },
        {
          id: 2,
          url: "/music-ark/singer",
          txt: "歌手"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.music-ark {
  height: calc(100% - 90px);
}
.router-link-active {
  color: $font-color-k !important;
  transition: all 0.3s ease-in-out;
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: $font-color-k;
  }
}
nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: $font-size-medium-x;
  & > div {
    position: relative;
    padding: 12px;
    box-sizing: border-box;
    color: $font-color-dark;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.fade-leave,
.fade-enter {
  transform: translateX(100%);
}
</style>