<template>
  <div class="playing-state song-wave">
    <span class="side1" :class="[playing?'playing-now':'pause']" :style="{backgroundColor:color}"></span>
    <span class="side2" :class="[playing?'playing-now':'pause']" :style="{backgroundColor:color}"></span>
    <span class="side3" :class="[playing?'playing-now':'pause']" :style="{backgroundColor:color}"></span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: "#ff5800"
    },
    // 是否播放
    playing: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.song-wave {
  position: relative;
  top: 0;
  left: 0;
  height: 20px;
  line-height: 16px;
  padding: 0 2px;
  box-sizing: border-box;
  text-align: center;
  background-color: transparent;

  span {
    position: absolute;
    bottom: 2px;
    width: 2px;
    &.side1 {
      left: 2px;
      height: 6px;
      animation: first 1s linear infinite;
    }
    &.side2 {
      left: 6px;
      height: 4px;
      animation: second 1s linear infinite;
    }
    &.side3 {
      left: 10px;
      height: 6px;
      animation: middle 1s linear infinite;
    }
    &.playing-now {
      animation-duration: 1s;
      animation-timing-function: linear;
      animation-delay: 0s;
      animation-iteration-count: infinite;
      animation-direction: normal;
      animation-fill-mode: none;
      animation-play-state: running;
    }
    &.pause {
      animation-play-state: paused;
    }
  }
}

@keyframes first {
  0% {
    height: 6px;
  }

  56% {
    height: 10px;
  }

  100% {
    height: 8px;
  }
}

@keyframes second {
  0% {
    height: 4px;
  }

  28% {
    height: 6px;
  }

  80% {
    height: 12px;
  }

  100% {
    height: 6px;
  }
}

@keyframes middle {
  0% {
    height: 10px;
  }

  56% {
    height: 8px;
  }

  100% {
    height: 6px;
  }
}
</style>