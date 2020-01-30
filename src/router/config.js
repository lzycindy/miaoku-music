
import musicArk from '@/views/music-ark/music-ark'
import recommend from '@/views/recommend/recommend'

const routes = [

    {
        path: '/music-ark',
        component: musicArk,
        children: [
            {
                path: 'recommend',
                component: recommend
            },

            {
                path: 'rank',
                component: () => import('../views/rank/rank.vue')
            },
            {
                path: 'singer',
                component: () => import('../views/singer/singer.vue')
            },
            {
                path: '/music-ark',
                redirect: 'recommend'
            }
        ]
    },
    // 设置
    {
        path: "/setting",
        component: () => import('../views/setting/setting.vue')
    },
    // 我的
    {
        path: '/mine',
        component: () => import('../views/mine/mine.vue')
    },
    // 我的收藏
    {
        path: '/favorite',
        component: () => import('../views/favorite/favorite.vue')
    },
    {
        path: '/history',
        component: () => import('../views/history-play/history-play.vue')
    },

    // 搜索
    {
        path: '/search',
        component: () => import('../views/search/search.vue')
    },
    // 推荐 歌单
    {
        path: '/music-ark/recommend/:id',
        component: () => import('../views/music-list/music-list.vue')
    },
    // 排行 歌单
    {
        path: '/music-ark/rank/:id',
        component: () => import('../views/rank-detail/rank-detail')
    },
    // 歌手详情
    {
        path: '/music-ark/singer/:id',
        component: () => import("../views/singer-detail/singer-detail.vue")

    },
    // 重定向
    {
        path: '*',
        redirect: '/music-ark/recommend'
    }
]

export default routes