<template>
  <div class="suggest-wrapper">
    <div class="search-suggest" v-show="!searchShow && query && songs.length > 0">
      <p class="title">最佳匹配</p>
    </div>
    <ul class="suggest-list" ref="suggestList" v-show="!searchShow">
      <li
        @click="selectSong(item)"
        class="suggest-item"
        v-for="(item, index) in songs"
        :key="index"
      >
        <div class="content">
          <p class="song">{{item.name}}</p>
          <p class="artist">{{item.singer}}</p>
        </div>
      </li>
      <Loading v-show="haveMore && query"></Loading>
    </ul>
    <div v-show="!haveMore && !songs.length && query" class="no-result">没有更多了</div>
  </div>
</template>

<script>
import { getSearchSuggest, getSearchSongs, getSongDetail } from "@/api/search";
import { createSearchSong } from "@/common/js/song";
import Loading from "@/components/loading/loading";
import { mapActions, mapMutations } from "vuex";

export default {
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      singer: {},
      songs: [],
      suggest: {},
      searchShow: true,
      page: 0,
      update: true,
      haveMore: true
    };
  },
  components: {
    Loading
  },
  methods: {
    search() {
      this.searchShow = false;
      this.haveMore = true;
      getSearchSongs(this.query, this.page).then(res => {
        if (!res.data.result.songs) {
          this.haveMore = false;
          return;
        }
        let list = res.data.result.songs;
        let ret = [];
        list.forEach(item => {
          ret.push(createSearchSong(item));
        });
        this.songs = ret;
        this.$emit("refresh");
      });
      this.page += 30;
      getSearchSuggest(this.query).then(res => {
        this.suggest = res.data.result;
      });
    },
    searchMore() {
      if (!this.haveMore) {
        return;
      }
      if (!this.songs.length) {
        return;
      }
      getSearchSongs(this.query, this.page).then(res => {
        let list = res.data.result.songs;
        if (!res.data.result.songs) {
          this.haveMore = false;
          return;
        }
        let ret = [];
        list.forEach(item => {
          ret.push(createSearchSong(item));
        });
        this.songs = [...this.songs, ...ret];
        this.$emit("refresh");
        this.page += 20;
      });
    },
    selectSong(item) {
      getSongDetail(item.id).then(res => {
        console.log(res);
        item.image = res.data.songs[0].al.picUrl;
        this.insertSong(item);
      });
      this.$emit("select");
    },
    ...mapMutations({
      setMusicList: "SET_MUSIC_LIST"
    }),
    ...mapActions(["insertSong"])
  },
  watch: {
    query(val) {
      if (val === "") {
        this.suggest = {};
        this.songs = [];
        this.haveMore = false;
        return;
      }
      this.suggest = {};
      this.songs = [];
      this.searchShow = true;
      this.page = 0;
      this.haveMore = true;
      this.search();
    }
  }
};
</script>
<style lang="scss">
.suggest-wrapper {
  height: 100%;
  overflow: hidden;
  color: $font-color-dark;
  .search-suggest {
    .title {
      padding-left: 20px;
      padding-bottom: 10px;
      color: $font-color-light;
      font-size: $font-size-small;
    }
  }
  .suggest-list {
    padding-bottom: 30px;
    .suggest-item {
      display: flex;
      padding: 3px 20px;
      height: 50px;
      align-items: center;
      border-bottom: 1px solid rgba(195, 203, 194, 0.3);
      .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        p {
          padding: 3px 0;
          @include no-wrap;
          &.song {
            font-size: $font-size-medium-x;
          }
          &.artist {
            font-size: 12px;
          }
        }
      }
    }
  }
  .no-result {
    color: $font-color-g;
  }
}
</style>