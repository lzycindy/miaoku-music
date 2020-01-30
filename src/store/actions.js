import * as types from './mutation-types'
import { playMode } from '@/common/js/config'
import { shuffle } from '@/common/js/utl'

import { saveFavorite, savePlay, deleteFavorite } from '@/common/js/cache'
function findIndex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const sequencePlay = function ({ commit }, { list }) {

    commit(types.SET_PLAY_MODE, playMode.sequence)
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAYLIST, list)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}


export const selectPlay = function ({ commit, state }, { list, index }) {
    console.log('------------------------------------------------------')
    console.log(list, index)
    console.log('------------------------------------------------------')

    commit(types.SET_SEQUENCE_LIST, list)
    // 如果播放模式为随机
    if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}


export const insertSong = function ({ commit, state }, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    let currentSong = playlist[currentIndex]
    // 查找当前列表中是否有带插入的歌曲，并返回银锁
    let fpIndex = findIndex(playlist, song)
    // 因为是插入歌曲，所以索引+1
    currentIndex++
    // 插入歌曲
    playlist.splice(currentIndex, 0, song)
    // 如果已经包含这首歌
    if (fpIndex > -1) {
        // 如果当前插入的序号大于列列表中的序号
        if (currentIndex > fpIndex) {
            // 删掉
            playlist.splice(fpIndex, 1)
            // 因为删除后数组前移，所以 Index--
            currentIndex--
        } else {
            playlist.splice(fpIndex + 1, 1)
        }
    }

    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    let fsIndex = findIndex(sequenceList, song)

    sequenceList.splice(currentSIndex, 0, song)
    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fpIndex, 1)
        } else {
            sequenceList.splice(fpIndex + 1, 1)
        }
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}


// 清空播放列表

export const deletePlaylist = function ({ commit }) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}


// 删除指定歌曲
export const deleteSong = function ({ commit, state }, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)

    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    const playingState = playlist.length > 0
    // 如果歌曲删除完毕，那么 播放停止
    commit(types.SET_PLAYING_STATE, playingState)
}

// 播放记录
export const savePlayHistory = function ({ commit }, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}



// 收藏歌曲
export const saveFavoriteList = function ({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
// 删除收藏歌曲
export const deleteFavoriteList = function ({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
