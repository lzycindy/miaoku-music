<template>
  <div class="history-play">
    <v-touch @swiperight="back" class="history-play-vt">
      <header class="history-header">
        <div class="iconfont icon-back" @click="back"></div>
        <div class="setting-txt">最近播放</div>
      </header>
      <div class="sequence-play" v-show="playHistory.length>0" @click="sequence">
        <i class="iconfont icon-music_play_button"></i>
        <span class="text">播放全部</span>
        <span class="count">(共 {{playHistory.length}} 首)</span>
      </div>
      <BScroll
        v-show="playHistory.length>0"
        ref="historyList"
        class="historyList-scroll"
        :data="playHistory"
      >
        <songList @select="selectItem" :songs="playHistory"></songList>
      </BScroll>

      <div class="no-result-wrapper">
        <noResult title="你还没有听过歌~" v-show="playHistory.length===0"></noResult>
      </div>
    </v-touch>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import songList from "@/components/song-list/song-list";

import BScroll from "@/components/BScroll/BScroll";
import noResult from "@/components/no-result/no-result";

import { playlistMixin } from "@/common/js/mixin";
export default {
  mixins: [playlistMixin],

  components: {
    songList,
    BScroll,
    noResult
  },
  mounted() {
    this.SHOW_HEADER(false);
  },
  methods: {
    back() {
      this.$router.back();
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "3.57333rem" : "";
      this.$refs.historyList.$el.style.height = `calc(100vh - ${bottom})`;
      this.$refs.historyList.refresh();
    },
    // 列表选择播放
    selectItem(item) {
      console.log(item);
      this.insertSong(item);
    },
    // 全部播放  列表顺序播放
    sequence() {
      if (this.playHistory.length === 0) {
        return;
      }
      this.sequencePlay({
        list: this.playHistory
      });
    },
    ...mapActions(["insertSong", "sequencePlay"]),
    ...mapMutations({
      SHOW_HEADER: "SHOW_HEADER"
    })
  },
  computed: {
    ...mapGetters(["playHistory"])
  },
  destroyed() {
    this.SHOW_HEADER(true);
  }
};
</script>
<style lang="scss">
.history-play-vt {
  height: 100vh;
}
.history-header {
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
.sequence-play {
  position: relative;
  top: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding-left: 16px;
  box-sizing: border-box;
  // border-bottom: 1px solid rgb(228, 228, 228);
  &::after {
    @include border-bottom-1px(rgb(228, 228, 228));
  }

  .iconfont {
    font-size: $font-size-large;
    color: $font-color-dark;
    padding-right: 14px;
    font-weight: bold;
  }
  .text {
    font-size: $font-size-medium-x;
    color: $font-color-dark;
    overflow: hidden;
  }
  .count {
    font-size: $font-size-medium;
    color: $font-color-gray;
  }
}
.historyList-scroll {
  height: calc(100vh - 74px);
  overflow: hidden;
}
</style>