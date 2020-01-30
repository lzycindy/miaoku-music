import * as types from './mutation-types'

const mutation = {
    [types.SHOW_HEADER](state, flag) {  // 显示/隐藏header 
        state.isHeaderShow = flag
    },
    [types.SET_PLAY_MODE](state, mode) {  // 歌曲播放模式
        state.mode = mode
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index
    },
    [types.SET_PLAYLIST](state, list) {
        state.playlist = list
    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list
    },
    [types.SET_MUSIC_LIST](state, musicList) {
        state.musicList = musicList
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag
    },
    [types.SET_TOP_LIST](state, topList) {
        state.topList = topList
    },
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },
    [types.SET_FAVORITE_LIST](state, list) {
        state.favoriteList = list
    },
    [types.SET_PLAY_HISTORY] (state, history) {
        state.playHistory = history
      },
}

export default mutation