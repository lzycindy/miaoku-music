<template>
  <div class="search">
    <van-search
      v-model="query"
      placeholder="歌曲、歌手、专辑"
      show-action
      @search="onSearch"
      @cancel="onCancel"
    />
    <BScroll class="search-scroll-wrapper" ref="scroll" :pullup="pullup" @scrollToEnd="searchMore">
      <div>
        <!-- 热门搜索 -->
        <div ref="search">
          <div class="search-hot" v-show="!query">
            <h3 class="title">热门搜索</h3>
            <ul>
              <li
                v-for="item in hots"
                :key="item.first"
                @click="addQuery(item.first)"
              >{{item.first}}</li>
            </ul>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <Suggest @refresh="refresh" :query="query" ref="suggest"></Suggest>
        </div>
      </div>
    </BScroll>
  </div>
</template>
<script>
import storage from "good-storage";
import { getSearchHot } from "@/api/search";
import BScroll from "@/components/BScroll/BScroll";
import Suggest from "@/views/suggest/suggest";
import { playlistMixin } from "@/common/js/mixin";
import { mapMutations } from "vuex";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      query: "",
      hots: [],
      pullup: true
    };
  },
  components: {
    BScroll,
    Suggest
  },
  created() {
    this._getSearchHot();
  },
  mounted() {
    this.SHOW_HEADER(false);
  },
  methods: {
    _getSearchHot() {
      let hot = storage.get("searchHot");

      if (hot) {
        if (new Date().getTime() - hot.time < 1 * 24 * 60 * 60 * 1000) {
          this.hots = hot.data;
          return;
        }
      }
      getSearchHot().then(res => {
        this.hots = res.data.result.hots;
        storage.set("searchHot", {
          time: new Date().getTime(),
          data: res.data.result.hots
        });
      });
    },
    handlePlaylist(playlist) {
      const calc = playlist.length > 0 ? "2.8rem" : "1.44rem";
      this.$refs.scroll.$el.style.height = `calc(100vh - ${calc})`;
      this.$refs.scroll.refresh();
    },
    addQuery(item) {
      this.query = item;
    },
    refresh() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 20);
    },
    onSearch() {
      console.log("search");
    },
    onCancel() {
      console.log("cancel");
      this.$router.back();
    },
    searchMore() {
      this.$refs.suggest.searchMore();
    },
    ...mapMutations({
      SHOW_HEADER: "SHOW_HEADER"
    })
  },
  destroyed() {
    this.SHOW_HEADER(true);
  }
};
</script>

<style lang="scss">
.search {
  position: relative;
  height: 100vh;

  .van-search--show-action {
    background-color: transparent !important;
  }
  .van-search__content {
    border-radius: 6px;

    .van-cell,
    .van-cell input::placeholder,
    .van-cell input {
      color: $font-color-dark;
    }
  }
  .van-search__action {
    color: $font-color-dark !important;
    &:focus,
    &:hover,
    &:active {
      background-color: transparent;
    }
  }
  .search-scroll-wrapper {
    height: calc(100% - 54px);
    overflow: hidden;
  }
  .search-hot {
    height: calc(360px / 2);
    padding: 15px;
    box-sizing: border-box;
    .title {
      color: $font-color-dark;
      font-size: $font-size-medium-x;
    }
    ul {
      padding-top: 15px;
      display: flex;
      flex-wrap: wrap;
      li {
        padding: 6px 13px;
        margin: 2px 6px;

        border-radius: 10px;
        color: $font-color-dark;
        box-shadow: 1px 1px 2px 2px inset $shadow;
      }
    }
  }
}
</style>