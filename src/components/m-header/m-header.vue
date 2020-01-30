<template>
  <header class="m-header">
    <router-link to="/setting" tag="div" class="setting">
      <i class="iconfont icon-menu1"></i>
    </router-link>
    <router-link to="/mine" class="min" tag="div">我的</router-link>
    <router-link to="/music-ark" class="music-ark" tag="div">音乐柜</router-link>
    <router-link to="/search" class="iconfont icon-search" tag="div"></router-link>
  </header>
</template>


<style lang="scss" scoped>
.m-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background: $color-background;
  & > div {
    color: $font-color-dark;
    font-size: $font-size-large-x;
    padding: 15px;
    box-sizing: border-box;
    &:last-child {
      color: $font-color-f;
    }
  }
  .iconfont {
    display: block;
  }
  .mine,
  .setting,
  .search-icon {
    color: $font-color-f;
  }
}
.router-link-active {
  color: $font-color-f !important;
}
</style>
