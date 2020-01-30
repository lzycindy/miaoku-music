<template>
  <div class="mine">
    <router-link to="/favorite" tag="div" class="router-item">
      <div class="iconfont icon-ue746like1"></div>
      <div class="txt">我喜欢</div>
    </router-link>
    <router-link to="/history" tag="div" class="router-item">
      <div class="iconfont icon-bofangjilu"></div>
      <div class="txt">最近播放</div>
    </router-link>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.mine {
  color: $font-color-k;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  .router-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    .iconfont {
      font-size: 40px;
      font-weight: 400;
    }
    .txt {
      width: 100%;
      text-align: center;
      padding: 10px;
      color: $font-color-dark;
    }
  }
}
</style>