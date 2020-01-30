<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop="hide">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{title}}</p>
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "清空队列"
    },
    text: {
      type: String,
      default: "确定要清空播放队列?"
    },
    confirmText: {
      type: String,
      default: "确定"
    },
    cancelText: {
      type: String,
      default: "取消"
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    confirm() {
      this.hide();
      this.$emit("confirm");
    }
  }
};
</script>

<style scoped lang="scss">
.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.3);
  &.confirm-fade-enter-active {
    animation: fadein 0.3s;
    .confirm-content {
      animation: fzoom 0.3s;
    }
  }
  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    .confirm-content {
      width: 270px;
      border-radius: 5px;
      background: $color-background-x;
      .text {
        padding: 6px 15px;
        line-height: 22px;
        text-align: center;
        font-size: $font-size-medium-x;
        color: $font-color-g;
      }
      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-medium-x;
        position: relative;
        &::before {
          margin-top: -1px;
          @include border-top-1px;
        }
        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 12px 0;
          color: $font-color-k;
          &.left {
            color: $font-color-g;
            border-right: 1px solid #c3cbc2;
          }
        }
      }
    }
  }
}

@keyframes fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fzoom {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
