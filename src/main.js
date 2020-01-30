import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import 'lib-flexible/flexible'

import 'vant/lib/index.css'

import {
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Lazyload,
  Search,
  Slider,
  Cell,
  Toast,
  NoticeBar
} from 'vant';

Vue.use(Swipe)
  .use(SwipeItem)
  .use(Grid)
  .use(GridItem)
  .use(Lazyload, {
    loading: require('./assets/image/loading.gif'),
    error: require('./assets/image/default.png')
  })
  .use(Search)
  .use(Slider)
  .use(Cell)
  .use(Toast)
  .use(NoticeBar)


// touch
import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name: 'v-touch' })
VueTouch.config.swipe = {
  threshold: 100  // 手指左右滑动的距离
}


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
