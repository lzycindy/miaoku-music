<template>
  <div class="rank" ref="rank">
    <BScroll class="toplist" ref="scroll">
      <ul>
        <li class="item" v-for="item in yunTopList" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.coverImgUrl" width="100" height="100" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.top" :key="index">
              <span>{{index + 1}}.</span>
              <span>{{song.name}} - {{song.ar[0].name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </BScroll>
    <router-view></router-view>
  </div>
</template>

<script>
import storage from "good-storage";

import BScroll from "@/components/BScroll/BScroll";
import { mapMutations } from "vuex";
import { TopList } from "@/api/rank";
import { playlistMixin } from "@/common/js/mixin";
const TOPLIST_IDS = [1, 3, 4, 22, 23, 27, 17, 26, 7];

export default {
  mixins: [playlistMixin],
  data() {
    return {
      yunTopList: []
    };
  },
  mounted() {
    this._getTopList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "1.6rem" : "";
      this.$refs.rank.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    selectItem(item) {
      this.$router.push({
        path: `/music-ark/rank/${item.id}`
      });
      this.setTopList(item);
    },
    _getTopList() {
      let yunList = storage.get("yunTopList");
      if (yunList) {
        if (new Date().getTime() - yunList.time < 15 * 24 * 60 * 60 * 1000) {
          this.yunTopList = yunList.data;
          return;
        }
      }
      for (let i = 0; i < TOPLIST_IDS.length; i++) {
        TopList(TOPLIST_IDS[i]).then(res => {
          let list = res.data.playlist;
          list.top = res.data.playlist.tracks.slice(0, 3);
          this.yunTopList.push(list);

          if (this.yunTopList.length === TOPLIST_IDS.length) {
            storage.set("yunTopList", {
              time: new Date().getTime(),
              data: this.yunTopList
            });
          }
        });
      }
    },
    ...mapMutations({
      setTopList: "SET_TOP_LIST"
    })
  },
  components: {
    BScroll
  }
};
</script>

<style lang="scss">
.rank {
  position: fixed;
  width: 100%;
  top: 90px;
  bottom: 0;
  color: $font-color-dark;
  .toplist {
    height: 100%;
    overflow: hidden;
    padding-top: 5px;
    .item {
      display: flex;
      margin: 0 10px;
      padding: 3px 0;
      height: 100px;
      position: relative;
      &::after {
        @include border-bottom-1px(rgb(228, 228, 228));
      }
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
        img {
          border-radius: 3px;
        }
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        .song {
          @include no-wrap;
          line-height: 30px;
        }
      }
    }
  }
}
</style>