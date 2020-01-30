<template>
  <div class="loading">
    <div class="loading-effect">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <p class="title">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "数据加载中..."
    }
  }
};
</script>
<style lang="scss" scoped>
.loading-effect {
  width: 50px;
  height: 50px;
  position: relative;
  margin: 0 auto;

  span {
    display: inline-block;
    width: 15px;
    height: 5px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background: #777;
    position: absolute;
    animation: loading 1.04s ease infinite;

    &:nth-child(1) {
      left: 0;
      top: 50%;
      margin-top: -5px;
      animation-delay: 0.13s;
    }
    &:nth-child(2) {
      left: 5px;
      top: 10px;
      transform: rotate(45deg);
      animation-delay: 0.26s;
    }
    &:nth-child(3) {
      left: 50%;
      top: 5px;
      margin-left: -7.5px;
      transform: rotate(90deg);
      animation-delay: 0.39s;
    }
    &:nth-child(4) {
      top: 10px;
      right: 5px;
      transform: rotate(135deg);
      animation-delay: 0.52s;
    }
    &:nth-child(5) {
      right: 0;
      top: 50%;
      margin-top: -2.5px;
      transform: rotate(180deg);
      animation-delay: 0.65s;
    }
    &:nth-child(6) {
      right: 5px;
      bottom: 10px;
      transform: rotate(225deg);
      animation-delay: 0.78s;
    }
    &:nth-child(7) {
      bottom: 10px;
      left: 50%;
      margin-left: -7.5px;
      transform: rotate(270deg);
      animation-delay: 0.91s;
    }
    &:nth-child(8) {
      bottom: 10px;
      left: 5px;
      transform: rotate(315deg);
      animation-delay: 1.04s;
    }
  }
  @keyframes loading {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }
}

.title {
  padding-top: 10px;
  text-align: center;
  color: #2ca2f9;
  opacity: 0.6;
  font-size: 12px;
}
</style>