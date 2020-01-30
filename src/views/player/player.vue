<template>
  <div class="music-player" v-show="playlist.length > 0">
    <!-- xxx -->
    <div :class="['min-m', fullScreen? 'min-rotateY':'']">
      <div class="left" @click.capture="openFullScreen">
        <div class="cover">
          <img :class="[playing?'playing':'paused']" :src="currentSong.image" alt />
        </div>
      </div>
      <div class="right">
        <!-- 进度条 -->
        <van-slider
          v-model="percent"
          active-color="#2ca2f9"
          :min="0"
          :max="duration<=0?100:parseInt(duration)"
          @change="onChange"
        />
        <div class="controller">
          <div class="music-info" @click.capture="openFullScreen">
            <p class="m-name">{{currentSong.name}}</p>
            <p class="m-artist">{{currentSong.singer}}</p>
          </div>
          <div class="operators">
            <div @click="togglePlaying" class="iconfont" :class="mini_playIcon"></div>
            <div class="iconfont icon-skip-next" @click="next"></div>
            <div class="iconfont icon-musiclist" @click="showPlaylist"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 全屏 -->

    <div :class="['full-screen',fullScreen? 'isfullScreen':'']">
      <div class="blurMask"></div>
      <div class="blurBg" :style="`background:url(${currentSong.image})`"></div>
      <div class="top-back">
        <div>
          <div class="iconfont icon-back" @click.capture="closeFullScreen"></div>
          <div class="m-name">{{currentSong.name}}</div>
          <div
            class="iconfont"
            @click="toggleFavorite(currentSong)"
            :class="getFavoriteIcon(currentSong)"
          ></div>
        </div>
        <h3 class="song-artist">{{currentSong.singer}}</h3>
      </div>
      <v-touch
        class="changeMiddle"
        @tap="changeMiddleLyric_CD"
        @swipeleft="next()"
        @swiperight="prev()"
      >
        <!-- 唱片 -->
        <Disc v-show="currentShow === 'cd'" :isplaying="playing" :picUrl="currentSong.image"></Disc>
        <!-- 歌词 -->
        <BScroll
          class="lyric"
          ref="lyricList"
          v-show="currentShow === 'lyric'"
          :data="currentLyric && currentLyric.lines"
        >
          <div class="lyric-wrapper">
            <div class="currentLyric" v-if="currentLyric">
              <p
                ref="lyricLine"
                class="text"
                :class="{'current': currentLineNum === index}"
                v-for="(line, index) in currentLyric.lines"
                :key="line.key"
              >{{line.txt}}</p>
            </div>
            <p class="no-lyric" v-if="currentLyric===null">暂无歌词</p>
          </div>
        </BScroll>
      </v-touch>

      <!-- 控件  -->
      <div class="control">
        <div class="top">
          <div class="current-time">{{format(currentTime)}}</div>
          <!-- 进度条 -->
          <van-slider
            v-model="percent"
            active-color="#2ca2f9"
            :min="0"
            :max="duration<=0?100:parseInt(duration)"
            @change="onChange"
          />
          <div class="duration">{{format(duration)}}</div>
        </div>
        <div class="bottom operators">
          <div class="mode iconfont" :class="iconMode" @click="changeMode"></div>
          <div class="iconfont icon-skip-previous" @click="prev"></div>
          <div @click="togglePlaying" class="iconfont" :class="playIcon"></div>
          <div class="iconfont icon-skip-next" @click="next"></div>
          <div class="iconfont icon-list" @click="showPlaylist"></div>
        </div>
      </div>
    </div>
    <audio
      id="music-audio"
      ref="audio"
      @ended="end"
      autoplay
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    ></audio>
    <Playlist ref="playlist" @stopMusic="stopMusic"></Playlist>
  </div>
</template>
<script>
import disc from "@/components/disc/disc";
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/utl";
import { getSong, getLyric } from "@/api/song";
import Lyric from "lyric-parser";
import { mapMutations, mapGetters, mapActions } from "vuex";
import Playlist from "@/views/playlist/playlist";
import BScroll from "@/components/BScroll/BScroll";

export default {
  data() {
    return {
      url: "",
      songReady: false,
      currentTime: 0,
      duration: 0,
      percent: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: "",
      noLyric: false
    };
  },
  components: {
    Disc: disc,
    Playlist,
    BScroll
  },
  computed: {
    iconMode() {
      if (this.mode === playMode.sequence) {
        return "icon-loop";
      } else if (this.mode === playMode.loop) {
        return "icon-loop1";
      } else {
        return "icon-random";
      }
    },
    playIcon() {
      // 全屏播放按钮
      return this.playing
        ? "icon-music_pause_button"
        : "icon-music_play_button";
    },
    mini_playIcon() {
      // mini播放按钮
      return this.playing ? "icon-pause" : "icon-play";
    },

    ...mapGetters([
      "currentSong",
      "playing",
      "currentIndex",
      "playlist",
      "mode",
      "sequenceList",
      "fullScreen",
      "favoriteList"
    ])
  },
  methods: {
    // 唱片/歌词显示与隐藏
    changeMiddleLyric_CD() {
      if (this.currentShow === "cd") {
        this.currentShow = "lyric";
        console.log("歌词显示");
      } else {
        this.currentShow = "cd";
        console.log("cd显示");
      }
    },
    stopMusic() {
      // 删除最后一首的时候暂停音乐
      this.$refs.audio.pause();
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this._resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;

      this.percent = parseInt(e.target.currentTime);
    },

    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek();
      }
    },
    error(e) {
      console.log(e);
      let code = e.target.networkState;
      if (code == 3) {
        this.$toast({
          overlay: true,
          message: "该歌曲\n无法播放"
        });
        setTimeout(() => {
          this.next();
        }, 2000);
      }
      this.songReady = true;
    },
    ready() {
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
    },

    next() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        // this.$refs.audio.play()
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      this.songReady = false;
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songReady = false;
    },

    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return "icon-favorites_fill";
      }
      return "icon-favorite-border";
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id;
      });
      return index > -1;
    },
    // 进度条改变播放位置
    onChange(value) {
      const audio = this.$refs.audio;
      this.currentTime = value;
      audio.currentTime = value;
      this.percent = parseInt(this.currentTime);
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    // 播放 暂停
    togglePlaying() {
      const audio = this.$refs.audio;
      this.setPlayingState(!this.playing);
      this.playing ? audio.play() : audio.pause();
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    _getSong(id) {
      // 获取播放地址
      console.log(id);
      getSong(id).then(res => {
        this.url = res.data.data[0].url;
      });
    },
    // 获取歌词
    _getLyric(id) {
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentLyric = null;
      }
      this.noLyric = false;
      getLyric(id)
        .then(res => {
          console.log(res);
          this.currentLyric = new Lyric(res.data.lrc.lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
            // 歌词重载以后 高亮行设置为 0
            this.currentLineNum = 0;
            this.$refs.lyricList.scrollTo(0, 0, 1000);
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.noLyric = true;
          this.currentLineNum = 0;
        });
    },
    // 歌词滚动
    handleLyric({ lineNum, txt }) {
      console.log(lineNum, txt);
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
    },
    showPlaylist() {
      this.$refs.playlist.show();
    },
    // 全屏
    // cd 歌词
    openFullScreen() {
      this.setFullScreen(true);
    },
    // 关闭全屏
    closeFullScreen() {
      this.setFullScreen(false);
      this.currentShow = "cd";
    },
    // 时间格式化
    format(interval) {
      interval = interval | 0;
      let minute = (interval / 60) | 0;
      let second = interval % 60;
      let s = second < 10 ? "0" + second : second;
      return minute + ":" + s;
    },
    ...mapActions([
      "saveFavoriteList",
      "savePlayHistory",
      "deleteFavoriteList"
    ]),
    ...mapMutations({
      setPlayMode: "SET_PLAY_MODE",
      setPlaylist: "SET_PLAYLIST",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setFullScreen: "SET_FULL_SCREEN"
    })
  },

  watch: {
    currentSong(newVal, oldVal) {
      console.log(newVal, oldVal);
      if (!newVal.id) {
        return;
      }
      if (newVal.id === oldVal.id) {
        return;
      }

      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
      this._getSong(newVal.id);
    },
    url(newUrl) {
      this._getLyric(this.currentSong.id);
      this.$refs.audio.src = newUrl;

      let stop = setInterval(() => {
        this.duration = this.$refs.audio.duration;
        if (this.duration) {
          clearInterval(stop);
        }
      }, 150);
      this.setPlayingState(true);
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

.music-player {
  .van-slider {
    transform: translateY(-4px);
  }
  .van-slider__button {
    width: 10px;
    height: 10px;
  }
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;

  // mini
  .min-m {
    position: relative;
    height: 60px;
    padding: 0 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.3s linear;
    background: $color-background-player;
    box-sizing: border-box;
    &.min-rotateY {
      transform: translateY(60px);
    }
    .left {
      transform: translateY(-10px);
      margin-right: 10px;
      display: flex;
      justify-content: center;
      position: relative;
    }
    .left .cover {
      width: 60px;
      height: 60px;
      background: url("../../assets/image/disc_default.png") no-repeat;
      background-size: contain;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }

    .right {
      position: relative;
      flex: 4;
      .controller {
        margin-top: 6px;
        display: flex;
        justify-content: space-between;
        align-content: center;
        .music-info {
          width: 60%;
          .m-name,
          .m-artist {
            @include no-wrap;
          }
          .m-artist {
            color: $font-color-gray;
            margin-top: 3px;
          }
        }
        .operators {
          flex: 2;
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          font-size: 28px;
        }
      }
    }
  }

  //   display: none;
  //   全屏
  .full-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    transform-origin: right bottom;
    transform: rotate(90deg);
    transition: transform 0.3s linear;

    background: #000000;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
    &.isfullScreen {
      transform: rotate(0deg);
    }

    .blurMask {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.3);
      width: 100%;
      height: 100%;
      z-index: 10;
    }
    .blurBg {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      filter: blur(90px);
      background-repeat: no-repeat;
      background-size: cover;
      z-index: 9;
    }
    .blurBg,
    .blurMask {
      opacity: 0.6;
      filter: alpha(opacity=60);
    }
    .top-back {
      position: fixed;
      width: 100%;
      z-index: 12;
    }
    .top-back > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // padding-right: 8px;
      box-sizing: border-box;
      font-size: $font-size-medium-x;
      .icon-back,
      .icon-favorite-border,
      .icon-favorites_fill {
        font-size: $font-size-large-xx;
        padding: 6px 6px;
      }
      .icon-favorites_fill {
        color: #c72f24;
      }
      .m-name {
        flex: 1;
        text-align: center;
        @include no-wrap;
        padding: 6px 0;
        font-size: $font-size-large-s;
      }
    }
    .top-back .song-artist {
      font-size: $font-size-medium-x;
      text-align: center;
      width: 80%;
      @include no-wrap;
      margin: 0 auto;
    }
    // 歌词
    .changeMiddle {
      width: 100%;
      height: calc(100% - 132px);
      position: absolute;
      z-index: 13;
      top: 50px;
    }
    .lyric {
      position: relative;
      height: calc(100% - 46px);
      overflow: hidden;
      z-index: 13;
      transform: translateY(20px);
    }
    .lyric-wrapper {
      width: 80%;
      margin: 0 auto;
      overflow: hidden;
      text-align: center;
      .text {
        line-height: 40px;
        color: $font-color-f;
        font-size: $font-size-medium;
        &.current {
          color: $font-color-k;
        }
      }
      .no-lyric {
        line-height: 40px;
        margin-top: 60%;
        color: $font-color-f;
        font-size: $font-size-medium;
      }
    }

    // 控制面板
    .control {
      padding: 0 6px;
      box-sizing: border-box;
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      z-index: 15;
      box-sizing: border-box;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        & > div {
          padding: 0 8px;
        }
        .van-slider {
          padding: 0;
          flex: 1;
        }
      }
      .operators {
        margin-top: 28px;
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        font-size: 30px;
        .icon-music_play_button,
        .icon-music_pause_button {
          font-size: 38px;
        }
      }
    }
  }
}
</style>