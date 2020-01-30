<template>
  <div class="favorite">
    <v-touch @swiperight="back" class="favorite-vt">
      <header class="favorite-header">
        <div class="iconfont icon-back" @click="back"></div>
        <div class="setting-txt">我喜欢</div>
      </header>

      <div class="sequence-play" v-show="favoriteList.length>0" @click="sequence">
        <i class="iconfont icon-music_play_button"></i>
        <span class="text">播放全部</span>
        <span class="count">(共 {{favoriteList.length}} 首)</span>
      </div>
      <BScroll
        ref="favoriteList"
        v-show="favoriteList.length>0"
        class="favorite-scroll"
        :data="favoriteList"
      >
        <songList @select="selectItem" :songs="favoriteList"></songList>
      </BScroll>

      <div class="no-result-wrapper">
        <noResult v-show="favoriteList.length===0" title="倾听世界，寻找属于自己最爱的MUSIC~"></noResult>
      </div>
    </v-touch>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import songList from "@/components/song-list/song-list";
import noResult from "@/components/no-result/no-result";
import BScroll from "@/components/BScroll/BScroll";
import { playlistMixin } from "@/common/js/mixin";
export default {
  mixins: [playlistMixin],
  mounted() {
    this.SHOW_HEADER(false);
  },
  components: {
    songList,
    BScroll,
    noResult
  },
  methods: {
    back() {
      this.$router.back();
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "3.57333rem" : "";
      this.$refs.favoriteList.$el.style.height = `calc(100vh - ${bottom})`;
      this.$refs.favoriteList.refresh();
    },
    // 列表选择播放
    selectItem(item) {
      console.log(item);
      this.insertSong(item);
    },
    // 全部播放  列表顺序播放
    sequence() {
      if (this.favoriteList.length === 0) {
        return;
      }
      this.sequencePlay({
        list: this.favoriteList
      });
    },
    ...mapActions(["insertSong", "sequencePlay"]),
    ...mapMutations({
      SHOW_HEADER: "SHOW_HEADER"
    })
  },
  computed: {
    ...mapGetters(["favoriteList"])
  },
  destroyed() {
    this.SHOW_HEADER(true);
  }
};
</script>
<style lang="scss">
.favorite-vt {
  height: 100vh;
}
.favorite-header {
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
.favorite-scroll {
  height: calc(100vh - 74px);
  overflow: hidden;
}
</style>