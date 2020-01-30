<template>
  <div class="no-result">
    <div class="iconfont icon-musicfill"></div>
    <p class="no-result-text">{{title}}</p>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss">
.no-result {
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
  .iconfont {
    color: $font-color-k;
    font-weight: 600;
    font-size: 38px;
  }
  .no-result-text {
    margin-top: 30px;
    font-size: $font-size-medium;
    color: $font-color-g;
  }
}
</style>