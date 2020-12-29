//状态层要放的是cate里面获取的list，因为很多地方要用，所有放在状态层里会很方便


import {reqCateList} from "../../utils/http"
let state={
    //存放初始化数据
     list:[]
}
// mutations,getters,actions,里面放的都是函数

let mutations={
    //修改数据，或者说给数据赋值
    //state 当前仓库     arr 传参
    changeList(state,arr){
        state.list=arr
    }
}
let getters={
    //导出list数据
    list(state){
        return state.list;
    }
}
let actions={
    //做逻辑，异步操作
    //context  当前仓库
    
    reqList(context){
        reqCateList({istree:true}).then(res=>{
            if(res.data.code==200){
                //res.data.list给了changeist里面的arr
                context.commit("changeList",res.data.list)
            }
        })
    }
}

export default{
    state,
    mutations,
    getters,
    actions,
    namespaced:true
}