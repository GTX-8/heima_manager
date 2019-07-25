// 引入vue
import Vue from 'vue'
// 引入vue-router
import VueRouter from 'vue-router'
// 引入登录组件
import Login from '@/views/login.vue'
// 引入首页的组件
import Home from '@/views/home.vue'
// 引入欢迎页面
import Welcome from '@/views/welcome.vue'
// 引入users组件
import Users from '@/views/users/user.vue'
// 引入right组件
import Right from '@/right/right.vue'
// 引入role组件
import Role from '@/right/role.vue'
// 使用
Vue.use(VueRouter)
// 创建路由配置
var router = new VueRouter({
  // 添加路由配置
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        {
          name: 'rights',
          path: 'rights',
          component: Right
        },
        {
          name: 'roles',
          path: 'roles',
          component: Role
        }
      ]
    }
  ]
})
// 暴露
export default router
