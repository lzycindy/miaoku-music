import { playMode } from '@/common/js/config'
import { loadFavorite, loadPlay } from '@/common/js/cache'
const state = {
    musicList: {},
    // 播放
    playing: false,
    // 顺序列表
    sequenceList: [],
    // 播放列表
    playlist: [],
    // play mode
    mode: playMode.sequence,
    currentIndex: -1,
    // 全屏
    fullScreen: false,
    singer: {},
    // 排行榜
    topList: {},
    playHistory: loadPlay(),
    favoriteList: loadFavorite(),
    //
    isHeaderShow: true
}

export default state