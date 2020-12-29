// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 2.vuex： 安装 目录 引入 挂到根实例
import store from "./store"

//引入resets
import "./assets/css/reset.css"

// 5.公共组件
import "./components"

//引入element-ui 
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  //创建仓库
  store,
  components: { App },
  template: '<App/>'
})
