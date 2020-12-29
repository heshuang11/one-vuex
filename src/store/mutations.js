export let state={
    //写在仓库里自动存储了信息，但是一刷新就没有了，所以再用会话存储存一下数据
    userInfo:sessionStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{}
}
export let getters={
    userInfo(state){
        return state.userInfo
    }
}
export let mutations={
    changeUserInfo(state,obj){
        state.userInfo=obj;
        //同步到本地存储  如果仓库有数据，就同步到本地，如果没有就删除
        if(obj.username){
            sessionStorage.setItem("userInfo",JSON.stringify(obj))
        }else{
            sessionStorage.removeItem("userInfo")
        }
    }
}