import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

import {actions} from "./actions"
import {state,getters,mutations} from "./mutations"
//引入模块
import cate from "./modules/cate"
import specs from "./modules/specs"
import goods from "./modules/goods"

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules:{
        //引入模块
        cate,
        specs,
        goods
    } 
})