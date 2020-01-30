<template>
  <transition name="fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <header class="list-header">
          <div class="content">
            <div>
              <span class="iconfont" :class="iconMode" @click="changeMode"></span>
              <span class="text">
                {{ modeText }}
                (
                <span class="count">{{playlist.length}}</span>
                )
              </span>
            </div>
            <div class="clear" @click="showConfirm">
              <i class="iconfont icon-delete"></i>
            </div>
          </div>
        </header>
        <BScroll
          ref="listContent"
          class="list-content"
          :data="sequenceList"
          :refreshDelay="refreshDelay"
        >
          <ul>
            <li
              class="item"
              ref="listItem"
              @click="selectItem(item, index)"
              v-for="(item, index) in sequenceList"
              :key="item.id"
            >
              <div class="wave" v-if="currentSong.id == item.id">
                <songWave :playing="playing" color="#2ca2f9"></songWave>
              </div>
              <div class="index" v-else>{{index+1}}</div>

              <p class="text" :class="CurrentText(item)">{{item.name}}</p>
              <span class="delete" @click.stop="deletOne(item)">
                <i class="iconfont icon-close"></i>
              </span>
            </li>
          </ul>
        </BScroll>
      </div>
      <Confirm ref="confirm" @confirm="confirmClear"></Confirm>
    </div>
  </transition>
</template>

<script>
import BScroll from "@/components/BScroll/BScroll";
import songWave from "@/components/wave/wave";
import Confirm from "@/components/confirm/confirm";
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/utl";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      showFlag: false,
      refreshDelay: 100
    };
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random
        ? "随机播放"
        : "单曲循环";
    },
    iconMode() {
      if (this.mode === playMode.sequence) {
        return "icon-loop";
      } else if (this.mode === playMode.loop) {
        return "icon-loop1";
      } else {
        return "icon-random";
      }
    },

    ...mapGetters([
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList"
    ]),
    ...mapState(["playing"])
  },
  methods: {
    // 弹框
    showConfirm() {
      this.$refs.confirm.show();
    },
    // 清空播放列表
    confirmClear() {
      this.deletePlaylist();
      this.hide();
      this.$emit("stopMusic");
    },
    deletOne(item) {
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
        this.$emit("stopMusic");
      }
    },
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        // 找到需要播放的歌曲在播放顺序里面的索引
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setCurrentIndex(index);
      this.showFlag = false;
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      console.log(this.mode);
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    // 当前播放歌曲高亮显示
    CurrentText(item) {
      if (this.currentSong.id === item.id) {
        return "current-play";
      }
      return "";
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        // 返回 index
        return item.id === this.currentSong.id;
      });
      console.log("index", index);
      this.setCurrentIndex(index);
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    ...mapActions(["deleteSong", "deletePlaylist"])
  },
  components: {
    BScroll,
    songWave,
    Confirm
  }
};
</script>


<style lang="scss">
.playlist {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 120;
  background: $color-background-d;
  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity 0.3s linear;
    .list-wrapper {
      transition: all 0.3s linear;
    }
  }
  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 6px;
    bottom: 10px;
    right: 6px;
    border-radius: 8px;
    background-color: $color-background-x;
    .list-header {
      position: relative;
      padding: 15px 30px 10px 15px;
      box-sizing: border-box;
      .content {
        display: flex;
        justify-content: space-between;
        align-content: center;
        color: $font-color-dark;
        font-size: 17px;
        margin-top: 12px;
        .iconfont {
          font-size: $font-size-large-xx;
        }
        .clear {
          flex: 0 0 40px;
          text-align: right;
        }
      }
    }
  }
  .list-content {
    color: $font-color-dark;

    max-height: 340px;
    min-height: 340px;
    overflow: hidden;
    .item {
      display: flex;
      align-items: center;
      padding: 0 22px 0 20px;
      overflow: hidden;
      position: relative;
      &::after {
        @include border-bottom-1px;
      }
      .wave,
      .index {
        min-width: 24px;
        padding: 10px 4px 10px 0;
      }

      .text {
        flex: 1;
        @include no-wrap();
        line-height: 20px;
        font-size: $font-size-medium;
        color: $font-color-g;
        &.current-play {
          color: $font-color-k;
        }
      }
      .delete {
        font-size: $font-size-large;
        color: $font-color-dark;
        padding: 10px;
      }
    }
  }
}
</style>