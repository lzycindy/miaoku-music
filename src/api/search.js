import axios from 'axios'
import { HOST } from '../common/js/config'

export function search(name) {
    const url = HOST + `/search?keywords=${name}`

    return axios.get(url)
}

export function getSearchHot() {
    const url = HOST + `/search/hot`

    return axios.get(url)
}

export function getSearchSuggest(name) {
    const url = HOST + `/search/suggest?keywords=${name}`

    return axios.get(url)
}

export function getSearchSongs(name, page) {
    const url = HOST + `/search?keywords=${name}&offset=${page}`

    return axios.get(url)
}

export function getSongDetail(id) {
    const url = HOST + `/song/detail?ids=${id}`

    return axios.get(url)
}
