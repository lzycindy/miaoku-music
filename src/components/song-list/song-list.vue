<template>
  <div class="song-list">
    <div class="item" v-for="(item,index) in songs" :key="item.id" @click="selectItem(item,index)">
      <div class="left index-avtor">
        <p class="count" v-if="count_index">{{index+1}}</p>
        <div class="avtor" v-show="currentSong.id==item.id">
          <img v-lazy="item.image" alt />
        </div>
      </div>

      <div class="content" :class="CurrentText(item)">
        <p class="name">{{item.name}}</p>
        <p class="desc">{{item.singer}}-{{item.album}}</p>
      </div>
      <div class="iconfont icon-music_play_button"></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    songs: {
      type: Array
    },
    // 是否显示索引
    count_index: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(["currentSong"])
  },
  methods: {
    selectItem(item, index) {
      this.$emit("select", item, index);
    },
    // 当前播放歌曲高亮显示
    CurrentText(item) {
      if (this.currentSong.id === item.id) {
        return "current-play";
      }
      return "";
    }
  }
};
</script>

<style lang="scss">
.song-list {
  color: $font-color-dark;
  .item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-content: center;
    padding: 10px 0;
    box-sizing: border-box;
    &::after {
      @include border-bottom-1px();
    }
    .index-avtor {
      flex: 0 0 40px;
      width: 40px;
      text-align: center;
      line-height: 30px;
      position: relative;
      .count {
        font-size: $font-size-medium-x;
        color: $font-color-g;
      }
      .avtor {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        z-index: 9;
        transform: translateY(-50%);
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
      }
    }

    .iconfont {
      flex: 0 0 40px;
      width: 40px;
      text-align: center;
      line-height: 30px;
      font-size: $font-size-medium-x;
      color: $font-color-g;
    }
    .iconfont {
      font-weight: bold;
    }
    .content {
      flex: 1;
      overflow: hidden;
      color: $font-color-g;
      padding-left: 6px;
      &.current-play {
        color: $font-color-k;
      }
      .name {
        width: 90%;
        font-size: $font-size-medium-x;
        @include no-wrap;
      }
      .desc {
        width: 90%;
        @include no-wrap;
        margin-top: 4px;
      }
    }
  }
}
</style>