import axios from 'axios'
import { HOST } from '../common/js/config'

export function banner() {
    const url = HOST + '/banner?type=2'
    return axios.get(url)
}
// 精品歌单
export function personalized() {
    const url = HOST + '/personalized'
    return axios.get(url)
}

// 新歌速递

export function newsong() {
    const url = HOST + '/personalized/newsong'
    return axios.get(url)
}
// 歌单详情  歌单列表歌曲
export function listDetail(id) {
    const url = HOST + `/playlist/detail?id=${id}`
    return axios.get(url)
}