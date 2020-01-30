<template>
  <div class="music-list rank-detail">
    <v-touch @swiperight="back" class="rank-detail-vt">
      <header class="header" ref="header">
        <div class="back" @click="back">
          <i class="iconfont icon-back"></i>
        </div>
        <div class="title">{{headerTitle}}</div>
      </header>
      <BScroll
        class="list"
        @scroll="scroll"
        :probe-type="probeType"
        :listen-scroll="listenScroll"
        :data="listDetail"
        ref="list"
      >
        <div class="music-list-wrapper">
          <div
            class="bg-image"
            ref="bgImage"
            :style="`background-image: url(${topList.coverImgUrl})`"
          >
            <div class="filter"></div>
            <div class="text">
              <h2 class="list-title">{{topList.name}}</h2>
              <p class="updateTime">{{updateTime}}</p>
            </div>
          </div>

          <div class="song-list-wrapper">
            <div class="sequence-play" v-show="listDetail.length" @click="sequence">
              <i class="iconfont icon-music_play_button"></i>
              <span class="text">播放全部</span>
              <span class="count">(共 {{listDetail.length}} 首)</span>
            </div>
            <songList @select="selectItem" :songs="listDetail"></songList>
          </div>
        </div>
      </BScroll>
      <div class="loading-container" v-show="!listDetail.length">
        <Loading></Loading>
      </div>
    </v-touch>
  </div>
</template>

<script>
import BScroll from "@/components/BScroll/BScroll";
import songList from "@/components/song-list/song-list";
import Loading from "@/components/loading/loading";
import { createSong } from "@/common/js/song";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { playlistMixin } from "@/common/js/mixin";

const RESERVED_HEIGHT = 44;

export default {
  mixins: [playlistMixin],
  data() {
    return {
      headerTitle: "歌单",
      scrollY: 0,
      listDetail: []
    };
  },
  components: {
    songList,
    BScroll,
    Loading
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
    this._normalizeSongs(this.topList.tracks);
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    this.SHOW_HEADER(false);
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "40px" : "";
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    _normalizeSongs(list) {
      if (!this.topList.id) {
        this.$router.push("/rank");
        return;
      }
      let ret = [];
      list.forEach(item => {
        ret.push(createSong(item));
      });
      this.listDetail = ret;
    },
    // 列表选择播放
    selectItem(item, index) {
      console.log(item, index);
      this.selectPlay({
        list: this.listDetail,
        index: index
      });
    },
    // 全部播放  列表顺序播放
    sequence() {
      let list = this.listDetail;
      this.sequencePlay({
        list: list
      });
      console.log(list);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    ...mapMutations({
      SHOW_HEADER: "SHOW_HEADER"
    }),
    ...mapActions(["selectPlay", "sequencePlay"])
  },

  computed: {
    updateTime() {
      let time = new Date(this.topList.updateTime);
      let month = time.getMonth() + 1;
      let day = time.getDate();
      return `最近更新:${month}月${day}日`;
    },
    ...mapGetters(["topList"])
  },

  watch: {
    scrollY(newY) {
      const percent = Math.abs(newY / this.imageHeight);
      if (newY < this.minTranslateY + RESERVED_HEIGHT - 20) {
        this.headerTitle = this.topList.name;
      } else {
        this.headerTitle = "歌单";
      }
      if (newY < 0) {
        this.$refs.header.style.background = `rgba(44, 162, 249, ${percent})`;
      } else {
        this.$refs.header.style.background = `rgba(212, 68, 57, 0)`;
      }
    }
  },

  destroyed() {
    this.SHOW_HEADER(true);
  }
};
</script>


<style lang="scss">
.rank-detail {
  .rank-detail-vt {
    height: 100vh;
  }
  header {
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    z-index: 9;
    & > div {
      font-size: $font-size-large-x;
      &.back {
        padding: 8px;
      }
      &.title {
        padding: 8px;
        flex: 1;
        align-self: center;
        font-size: $font-size-large;
        @include no-wrap;
      }
    }
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;

    .bg-image {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 75%;
      transform-origin: top;
      background-size: cover;
      background-position: 0 30%;
      background-repeat: no-repeat;
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        opacity: 0.2;
      }
      .text {
        position: relative;
        width: 80%;
        bottom: 50px;
        left: 15px;
        .list-title {
          position: absolute;
          bottom: 0;
          width: 100%;
          font-size: $font-size-medium-x;
          font-weight: bold;
          letter-spacing: 1px;
          @include no-wrap;
        }
        .updateTime {
          position: absolute;
          bottom: -16px;
          font-size: $font-size-small;
        }
      }
    }
    .song-list-wrapper {
      padding: 41px 0 0 0;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      position: relative;
      top: -20px;
      background: $color-background-x;
      .sequence-play {
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        padding-left: 16px;
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
    }
  }
  .loading-container {
    position: fixed;
    width: 100%;
    top: 60%;
    transform: translateY(-50%);
  }
}
</style>