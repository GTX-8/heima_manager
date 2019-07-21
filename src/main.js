import Vue from 'vue'
import App from './App.vue'
// 映入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import '@/styles/index.less'
// 引入路由
import router from '@/router/index.js'
// 添加导航守卫
router.beforeEach((to, from, next) => {
  // 判断用户是否登录过或者是否跳转到login页,如果是则继续
  let token = localStorage.getItem('itcast_manage_34_token')
  if (token || to.path === '/login') {
    next()
  } else {
    // 否则,重定向到登录页
    next({ name: 'login' })
  }
})
// 让vue使用element-ui
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
