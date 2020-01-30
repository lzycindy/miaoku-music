<template>
  <div class="singer">
    <BScroll class="singer-content" ref="singerContent">
      <ul>
        <li v-for="group in singers" class="list-group" :key="group.title" ref="listGroup">
          <h2 class="list-group-title">{{ group.title }}</h2>
          <ul>
            <li
              @click="selectSinger(item)"
              v-for="item in group.items"
              class="list-group-item"
              :key="item.id"
            >
              <img v-lazy="item.avatar" class="avatar" />
              <span class="name">{{ item.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </BScroll>
  </div>
</template>

<script>
import storage from "good-storage";
import Singer from "@/common/js/singer";
import { getSingers } from "@/api/singer";
import BScroll from "@/components/BScroll/BScroll";
import { playlistMixin } from "@/common/js/mixin";

import { mapMutations } from "vuex";
const pinyin = require("pinyin");
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    };
  },
  components: {
    BScroll
  },
  created() {
    this._getSingers();
  },
  methods: {
    handlePlaylist(playlist) {
      const calc = playlist.length > 0 ? "4rem" : "2.4rem";
      this.$refs.singerContent.$el.style.height = `calc(100vh - ${calc})`;
      this.$refs.singerContent.refresh();
    },
    selectSinger(item) {
      this.$router.push({
        path: `/music-ark/singer/${item.id}`
      });
      this.setSinger(item);
    },

    _getSingers() {
      let singers = storage.get("singers");

      if (singers) {
        this.singers = singers.data;

        console.log(this.singers);
        return;
      }

      getSingers().then(res => {
        let result = res.data.artists;
        result.map(item => {
          let py = pinyin(item.name[0], {
            style: pinyin.STYLE_FIRST_LETTER
          });
          item.initial = py[0][0].toUpperCase();
        });
        this.singers = this._normalizeSinger(result);
        // 歌手本地持久化存储
        storage.set("singers", {
          time: new Date().getTime(),
          data: this.singers
        });
      });
    },

    _normalizeSinger(list) {
      let map = {};
      list.forEach(item => {
        const key = item.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias[0],
            briefDesc: item.briefDesc
          })
        );
      });
      let hot = [];
      let ret = [];
      for (const key in map) {
        let val = map[key];
        if (val.title.match(/[A-Z]/)) {
          ret.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return [...hot, ...ret];
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
};
</script>

<style lang="scss">
.singer {
  position: fixed;
  top: 90px;
  bottom: 0;
  left: 0;
  right: 0;
  .singer-content {
    height: calc(100vh - 90px);
    overflow: hidden;
    .list-group {
      .list-group-title {
        height: 20px;
        line-height: 20px;
        padding-left: 12px;
        margin-bottom: 10px;
        font-size: $font-size-small;
        color: $font-color-dark;
        background: #f5f5f5;
      }
      .list-group-item {
        display: flex;
        align-items: center;
        padding: 5px 0;
        margin: 0 5px;
        position: relative;
        box-sizing: border-box;
        &::after {
          @include border-bottom-1px;
        }
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 3px;
        }
        .name {
          margin-left: 20px;
          color: $font-color-dark;
          font-size: $font-size-medium;
        }
      }
    }
  }
}
</style>