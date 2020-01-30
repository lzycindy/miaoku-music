<template>
  <div class="m-song-disc">
    <div class="m-song-turn">
      <div class="m-song-rollwrap">
        <div class="m-song-img" :class="[isplaying?'playing':'paused']">
          <img :src="picUrl" alt />
        </div>
      </div>
      <div class="m-song-lgour">
        <div class="m-song-light"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isplaying: {
      type: Boolean,
      default: false
    },
    picUrl: {
      type: String,
      default: ""
    }
  }
};
</script>



<style lang="scss">
.playing {
  animation: rotate 8s infinite linear;
}
.paused {
  animation: rotate 8s infinite linear;
  animation-play-state: paused;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.m-song-disc {
  margin-top: 40px;
  height: 296px;
  width: 296px;
  margin: 90px auto 0;
  position: relative;
  z-index: 12;
  .m-song-turn {
    width: 100%;
    height: 100%;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      @include bg-image("../../assets/image/disc_light");
    }
    .m-song-rollwrap {
      width: 184px;
      height: 184px;
      margin: 0 auto;
      position: relative;
      transform: translateY(56px);
      .m-song-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        background: url("../../assets/image/disc_default.png") no-repeat;
        background-size: contain;
        img {
          width: 100%;
          vertical-align: middle;
        }
      }
    }
    .m-song-light {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 3;
      @include bg-image("../../assets/image/disc");
    }
  }
}
</style>