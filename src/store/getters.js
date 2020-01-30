import { getSong } from '@/api/song'

export const musicList = state => state.musicList   // 音乐列表
export const playlist = state => state.playlist   // 播放列表
export const mode = state => state.mode   //播放模式

export const playing = state => state.playing
export const sequenceList = state => state.sequenceList
export const fullScreen = state => state.fullScreen  // 全屏

export const currentIndex = state => state.currentIndex // 播放索引

export const singer = state => state.singer

export const topList = state => state.topList


export const favoriteList = state => state.favoriteList

export const playHistory = state => state.playHistory

export const currentSong = state => {
    console.log(state)

    return state.playlist[state.currentIndex] || {}
}

export const currentSongUrl = state => {

    getSong(state.playlist[state.currentIndex].id).then((res) => {
        console.log(state.playlist, 'res')
        return res.data.data.url || ''
    })
}
