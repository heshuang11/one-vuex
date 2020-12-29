import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


import store from "../store"

//封装一个函数，判断条件是如果有这个路由就可以跳转，如果没有不能跳转
function checkEnter(path, next) {
  if (store.state.userInfo.menus_url.includes(path)) {
    next()
  } else {
    next("/")
  }
}
//导出二级路由 因为add.vue的菜单地址用到二级路由，多个地方用到二级路由，就要导出 方法一: 数组拼接concat() 方法二:用的是 ...indexRoutes
export let indexRoutes = [
  {
    path: "menu",
    component: () => import("../pages/menu/menu.vue"),
    name: "菜单管理",
    //路由独享守卫，调用封装的方法
    beforeEnter(to,from,next){
      checkEnter("/menu",next)
    }
  },
  {
    path: "role",
    component: () => import("../pages/role/role.vue"),
    name: "角色管理",
    beforeEnter(to,from,next){
      checkEnter("/role",next)
    }
  },
  {
    path: "manage",
    component: () => import("../pages/manage/manage.vue"),
    name: "管理员管理",
    beforeEnter(to,from,next){
      checkEnter("/manage",next)
    }
  },
  {
    path: "cate",
    component: () => import("../pages/cate/cate.vue"),
    name: "商品分类",
    beforeEnter(to,from,next){
      checkEnter("/cate",next)
    }
  },
  {
    path: "specs",
    component: () => import("../pages/specs/specs.vue"),
    name: "商品规格",
    beforeEnter(to,from,next){
      checkEnter("/specs",next)
    }
  },
  {
    path: "goods",
    component: () => import("../pages/goods/goods.vue"),
    name: "商品管理",
    beforeEnter(to,from,next){
      checkEnter("/goods",next)
    }
  },
  {
    path: "member",
    component: () => import("../pages/member/member.vue"),
    name: "会员管理",
    beforeEnter(to,from,next){
      checkEnter("/member",next)
    }
  },
  {
    path: "banner",
    component: () => import("../pages/banner/banner.vue"),
    name: "轮播图管理",
    beforeEnter(to,from,next){
      checkEnter("/banner",next)
    }
  },
  {
    path: "seckill",
    component: () => import("../pages/seckill/seckill.vue"),
    name: "秒杀活动",
    beforeEnter(to,from,next){
      checkEnter("/seckill",next)
    }
  },
]

let router =  new Router({
  routes: [
    {
      path: "/login",
      component: () => import("../pages/login/login.vue")
    },
    {
      path: "/",
      component: () => import("../pages/index/index.vue"),
      children: [
        {
          path: "",
          component: () => import("../pages/home/home.vue")
        },
        ...indexRoutes
      ]
    },
  ]
})


//vue中使用store 用mapGetters,mapActions  js中使用store import store from "../store" 引入后通过store.state得到数据


//登录拦截  全局守卫
router.beforeEach((to, from, next) => {
  //如果去到是登录 next
  if (to.path === "/login") {
    next()
    return
  }
  //不是登录，判断是否登录，登录了，就next
  if (store.state.userInfo.id) {
    next()
    return
  }
  //否则 next("/login")
  next("/login")
})

export default router
