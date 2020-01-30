<template>
  <div class="recommend">
    <BScroll class="recommend-container" ref="scroll" :data="personalized">
      <div>
        <!-- 轮播图 -->
        <div class="banner">
          <van-swipe :autoplay="2000" indicator-color="#ebebeb">
            <van-swipe-item v-for="item in banners" :key="item.bannerId">
              <img :src="item.pic" alt />
            </van-swipe-item>
          </van-swipe>
        </div>
        <div class="container">
          <!-- 精品歌单 -->
          <div class="title">
            <h3>精品歌单</h3>
          </div>
          <div class="playlist-highquality">
            <van-grid :border="false" :column-num="3">
              <van-grid-item v-for="item in personalized" :key="item.id" @click="selectList(item)">
                <!-- :to="`/music-ark/recommend/${item.id}`" -->
                <div class="play-count">
                  <span class="iconfont icon-erji"></span>
                  {{playCount(item.playCount)}}
                </div>
                <img v-lazy="item.picUrl" alt />
                <div class="info-box">
                  <div class="info-txt">{{item.name}}</div>
                </div>
              </van-grid-item>
            </van-grid>
          </div>
          <!-- 新歌速递 -->
          <div class="title">
            <h3>新歌速递</h3>
          </div>
          <div class="playlist-new">
            <van-grid :border="false" :column-num="3">
              <van-grid-item v-for="item in newsonglist" :key="item.id" @click="selectSong(item)">
                <img v-lazy="item.image" alt />
                <div class="info-box">
                  <div class="info-txt name">{{item.name}}</div>
                  <div class="info-txt artist">{{item.singer}}</div>
                </div>
              </van-grid-item>
            </van-grid>
          </div>
        </div>
      </div>
    </BScroll>
    <router-view></router-view>
  </div>
</template>

<script>
import storage from "good-storage";
import BScroll from "@/components/BScroll/BScroll";
import { personalized, newsong, banner } from "@/api/recommend";
import { ERR_OK } from "@/common/js/config";
import { createRecommendSong } from "@/common/js/song";
import { mapActions, mapMutations } from "vuex";
import { playlistMixin } from "@/common/js/mixin";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      banners: [],
      personalized: [],
      newsonglist: []
    };
  },
  created() {
    this._getPersonalized();
    this._getNewsong();
    this._getBanner();
  },
  methods: {
    playCount(c) {
      if (c < 1e5) {
        return Math.floor(c);
      } else {
        return Math.floor(c / 10000) + "万";
      }
    },

    handlePlaylist(playlist) {
      const calc = playlist.length > 0 ? "4rem" : "2.4rem";
      this.$refs.scroll.$el.style.height = `calc(100vh - ${calc})`;
      this.$refs.scroll.refresh();
    },
    selectList(item) {
      this.$router.push({
        path: `/music-ark/recommend/${item.id}`
      });
      this.setMuiscList(item);
    },
    selectSong(item) {
      console.log(item);
      this.insertSong(item);
    },

    _getBanner() {
      let _banners = storage.get("banners");
      if (_banners) {
        if (new Date().getTime() - _banners.time < 120 * 60 * 1000) {
          this.banners = _banners.data;
          return;
        }
      }
      banner().then(res => {
        this.banners = res.data.banners;
        storage.set("banners", {
          time: new Date().getTime(),
          data: res.data.banners
        });
      });
    },
    _getPersonalized() {
      let local_personalized = storage.get("personalized");
      if (local_personalized) {
        if (new Date().getTime() - local_personalized.time < 120 * 60 * 1000) {
          this.personalized = local_personalized.data;
          return;
        }
      }
      personalized().then(res => {
        if (res.status === ERR_OK) {
          var data = res.data.result;
          data.map(item => {
            this.personalized.push(item);
          });
          storage.set("personalized", {
            time: new Date().getTime(),
            data: data
          });
        }
      });
    },

    _getNewsong() {
      // 新歌速递
      let new_song = storage.get("new_song");
      if (new_song) {
        if (new Date().getTime() - new_song.time < 120 * 60 * 1000) {
          this.newsonglist = new_song.data;
          return;
        }
      }
      newsong().then(res => {
        if (res.status === ERR_OK) {
          let list = res.data.result.map(item => {
            return createRecommendSong(item);
          });
          list.splice(9);
          this.newsonglist = list;
          storage.set("new_song", {
            time: new Date().getTime(),
            data: list
          });
        } else {
          console.error("获取失败了,请重新获取");
        }
      });
    },

    ...mapMutations({
      setMuiscList: "SET_MUSIC_LIST"
    }),
    ...mapActions(["insertSong"])
  },
  computed: {},
  components: {
    BScroll
  }
};
</script>


<style lang="scss">
.recommend {
  position: fixed;
  top: 90px;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background-x;
}
.recommend-container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 90px);
  overflow: hidden;
  .banner {
    min-height: 118.52px;
    .van-swipe-item {
      background: url("../../assets/image/slide.png") no-repeat;
      background-size: 100% 100%;
      img {
        min-height: 118.52px;
        width: 100%;
      }
    }
  }

  .container {
    padding-top: 6px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    box-shadow: 0 0 8px 0 inset $shadow;
    box-sizing: border-box;
    .title {
      padding: 6px;
      margin-top: 10px;
      font-size: $font-size-large-x;
      @include no-wrap;
      color: $font-color-dark;
    }
    .playlist-highquality {
      min-height: 200px;
    }

    .van-grid .van-grid-item .van-grid-item__content {
      padding: 8px 5px;
      background: transparent !important;

      .play-count {
        position: absolute;
        width: 80%;
        padding: 8px 5px;
        text-align: left;
        top: 6px;
      }
      img {
        min-height: 93.03px;
        width: 100%;
        border-radius: 6px;
      }
      .info-box {
        margin-top: 10px;
        width: 109px;
        height: 40px;
        .info-txt {
          color: $font-color-dark;
          font-size: $font-size-small-x;
          line-height: 16px;
          overflow: hidden;
          &.name {
            @include no-wrap;
          }
          &.artist {
            margin-top: 4px;
            color: $font-color-gray;
          }
        }
      }
    }
  }
}
</style>