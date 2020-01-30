<template>
  <div class="setting">
    <header>
      <div class="iconfont icon-back" @click="back"></div>
      <div class="setting-txt">设置</div>
    </header>
    <BScroll class="scroll" ref="settingScroll">
      <div>
        <ul class="list-group">
          <li class="list-category">播放与下载</li>
          <li class="list-group-item">
            <div class="list-title">歌曲下载品质</div>
            <!-- <div class="list-group-item"></div> -->
          </li>
          <li class="list-group-item">
            <div class="list-title">歌曲下载目录</div>
          </li>
          <li class="list-group-item">
            <div class="list-title">专辑封面自动旋转</div>
          </li>
          <li class="list-group-item">
            <div class="list-title">自动下载歌手写真</div>
          </li>
          <li class="list-category">功能与工具</li>

          <li class="list-group-item">
            <div class="list-title">青少年模式</div>
          </li>
          <li class="list-group-item">
            <div class="list-title">个性化展示内容</div>
          </li>
          <li class="list-group-item">
            <div class="list-title">定向广告推送</div>
          </li>
          <li class="list-group-item">
            <div class="list-title">清除缓存</div>
          </li>
          <li class="list-group-item">
            <div class="list-title">歌曲回收站</div>
          </li>
          <li class="list-group-item">
            <div class="list-title">清空消息记录</div>
          </li>
          <li class="list-category">关于</li>
          <li class="list-group-item">
            <div class="list-title">关于喵酷音乐</div>
          </li>
          <li class="list-group-item">
            <div class="list-title">帮助与反馈</div>
          </li>
        </ul>
      </div>
    </BScroll>
  </div>
</template>

<script>
import BScroll from "@/components/BScroll/BScroll";

import { mapMutations } from "vuex";

export default {
  mounted() {
    this.SHOW_HEADER(false);
  },

  components: {
    BScroll
  },
  methods: {
    back() {
      this.$router.back();
    },
    ...mapMutations({
      SHOW_HEADER: "SHOW_HEADER"
    })
  },

  destroyed() {
    this.SHOW_HEADER(true);
  }
};
</script>



<style lang="scss">
.setting {
  color: aliceblue;
  header {
    background-color: $color-background;
    display: flex;
    align-items: center;
    .icon-back {
      padding: 6px;
      font-size: $font-size-large-xx;
    }
    .setting-txt {
      flex: 1;
      display: flex;
      justify-content: center;
      padding-right: 6px;
      box-sizing: border-box;
      font-size: $font-size-large;
    }
  }
  .scroll {
    height: calc(100vh - 94px);
    overflow: hidden;
  }

  .list-group {
    padding: 10px 20px;
    color: $font-color-dark;
    font-size: $font-size-medium-x;
    .list-category {
      padding: 10px;
      font-size: 10px;
      color: $font-color-g;
    }
    .list-group-item {
      position: relative;
      padding: 10px;
      margin-bottom: 4px;
      &:last-child {
        margin-bottom: 0;
      }
      &::after {
        @include border-bottom-1px;
      }
    }
  }
}
</style>