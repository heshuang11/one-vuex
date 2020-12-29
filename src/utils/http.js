import axios from "axios"
import qs from "qs"
import Vue from "vue"
import { erroralert } from "./alert"
import router from "../router"
//引入仓库
import store from "../store"

//开发环境使用 8080
let baseUrl = "/api"
Vue.prototype.$pre = "http://10.10.18.49:3000"

//生产环境使用 打包
// let baseUrl=""
// Vue.prototype.$pre=""


//请求拦截，设置请求头
axios.interceptors.request.use(config=>{
    if(config.url!==baseUrl+"/api/userlogin"){
        config.headers.authorization=store.state.userInfo.token
    }
    return config
})

//响应拦截
axios.interceptors.response.use(res => {
    console.group("本次请求地址是" + res.config.url);
    console.log(res);
    console.groupEnd()
    //统一处理失败
    if (res.data.code !== 200) {
        erroralert(res.data.msg)
    }
    //统一处理list是null的情况
    if (!res.data.list) {
        res.data.list = []
    }

    //掉线处理
    if(res.data.msg==="登录已过期或访问权限受限"){
        //清除用户登录的信息 userInfo
        store.dispatch("changeUser",{})
        //跳到登录页面
        router.push("/login")
    }
    return res
})


//post带文件，参数转换
function dataToFormData(user) {
    let data = new FormData()
    for (let i in user) {
        data.append(i, user[i])
    }
    return data
}


//登录
export let reqLogin = (user) => {
    return axios({
        url: baseUrl + "/api/userlogin",
        method: "post",
        data: qs.stringify(user)
    })
}
// ------------------菜单接口---------------------
//菜单添加
//qs.stringify 使用它解决传文件的bug 有时候可能是空文件等  弹框显示的是添加按钮
export const reqMenuAdd = (user) => {
    return axios({
        url: baseUrl + "/api/menuadd",
        method: "post",
        data: qs.stringify(user)
    })
}

//列表
export const reqMenuList = () => {
    return axios({
        url: baseUrl + "/api/menulist",
        params: {
            istree: true
        }
    })
}

//删除
export let reqMenuDel = (obj) => {
    return axios({
        url: baseUrl + "/api/menudelete",
        method: "post",
        data: qs.stringify(obj)
    })
}

//编辑  菜单获取一条数据
// 逻辑 1.点击list的编辑,通知menu让弹框显示,
//  2.弹框是在add里面的,弹框显示并要带着对应的数据，所以获取的数据直接写在add里更方便add得到值
//  3.出来之后就要编辑里面的信息了，也就是点击修改按钮
export let reqMenuDetail = (obj) => {
    return axios({
        url: baseUrl + "/api/menuinfo",
        params: obj
    })
}

//编辑时修改的接口
export let reqMenuUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/menuedit",
        method: "post",
        data: qs.stringify(user)
    })
}


//--------------------角色接口--------------------------
//角色添加
export let reqRoleAdd = (user) => {
    return axios({
        url: baseUrl + "/api/roleadd",
        method: "post",
        data: qs.stringify(user)
    })
}
//角色列表
export let reqRoleList = () => {
    return axios({
        url: baseUrl + "/api/rolelist",
        // params:id
    })
}
//角色获取一条数据
export let reqRoleHuo = (obj) => {
    return axios({
        url: baseUrl + "/api/roleinfo",
        params: obj
    })
}

//角色删除
export let reqRoleDel = (id) => {
    return axios({
        url: baseUrl + "/api/roledelete",
        method: "post",
        data: qs.stringify(id)
    })
}

//角色修改
export let reqRoleUpdate = (obj) => {
    return axios({
        url: baseUrl + "/api/roleedit",
        method: "post",
        data: qs.stringify(obj)
    })
}


//-------------管理员管理

//管路员添加接口
export let reqManageAdd = (user) => {
    return axios({
        url: baseUrl + "/api/useradd",
        method: "post",
        data: qs.stringify(user)
    })
}

//管理员列表分页  obj={page:1,size:50}
export let reqManageList = (obj) => {
    return axios({
        url: baseUrl + "/api/userlist",
        params: obj
    })
}
//列表 obj={page:1,size:50}
export let reqManagelist = (obj) => {
    return axios({
        url: baseUrl + "/api/userlist",
        method: "get",
        params: obj
    })
}

//详情 user={uid:123342}
export let reqManageDetail = (user) => {
    return axios({
        url: baseUrl + "/api/userinfo",
        method: "get",
        params: user
    })
}

//修改 user={uid:"必填"}
export let reqManageUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/useredit",
        method: "post",
        data: qs.stringify(user)
    })
}

//删除 user={uid:13432}
export let reqManageDel = (user) => {
    return axios({
        url: baseUrl + "/api/userdelete",
        method: "post",
        data: qs.stringify(user)
    })
}
//管理员总数分页的接口
export let pages = () => {
    return axios({
        url: baseUrl + "/api/usercount",
    })
}

//------------------商品分类--------------


//商品分类添加
export let reqCateAdd = (user) => {
    return axios({
        url: baseUrl + "/api/cateadd",
        method: "post",
        data: dataToFormData(user)
    })
}

//商品分类列表 p={istree:true} {pid:1}
export let reqCateList = (p) => {
    return axios({
        url: baseUrl + "/api/catelist",
        params: p
    })
}

//商品分类获取一条  user={id:1}
export let reqCateInfo = (user) => {
    return axios({
        url: baseUrl + "/api/cateinfo",
        method: "get",
        params: user
    })
}

//商品修改  user={id:"必填",img:file,catename:""}
export let reqCateEdit = (user) => {
    return axios({
        url: baseUrl + "/api/cateedit",
        method: "post",
        data: dataToFormData(user)
    })
}

//商品删除 user={id:1}
export let reqCateDel = (user) => {
    return axios({
        url: baseUrl + "/api/catedelete",
        method: "post",
        data: qs.stringify(user)
    })
}

//-------------轮播图--------------
// 轮播图添加  title  img  status
export let reqBannerAdd = (user) => {
    return axios({
        url: baseUrl + "/api/banneradd",
        method: "post",
        data: dataToFormData(user)
    })
}

//轮播图列表
export let reqBannerList = () => {
    return axios({
        url: baseUrl + "/api/bannerlist",
        method: "get"
    })
}


//轮播图获取一条数据  {id:id}
export let reqBannerDetail = (user) => {
    return axios({
        url: baseUrl + "/api/bannerinfo",
        method: "get",
        params: user
    })
}

//轮播图修改  id title   img status
export let reqBannerUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/banneredit",
        method: "post",
        data: dataToFormData(user)
    })
}

//轮播图删除  {id:id}

export let reqBannerDel = (user) => {
    return axios({
        url: baseUrl + "/api/bannerdelete",
        method: "post",
        data: qs.stringify(user)
    })
}


//--------------------------会员管理---------------------

//会员列表
export let reqMemberList = () => {
    return axios({
        url: baseUrl + "/api/memberlist",
        method: "get"
    })
}

//会员获取   {uid:1}
export let reqMemberDetail = (user) => {
    return axios({
        url: baseUrl + "/api/memberinfo",
        method: "get",
        params: user
    })
}

//会员修改  uid nickname phone password  status
export let reqMemberUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/memberedit",
        method: "post",
        data: qs.stringify(user)
    })
}

//--------------------商品规格----------------
//添加 specsname  attrs属性   status
export let reqSpecsAdd = (user) => {
    return axios({
        url: baseUrl + "/api/specsadd",
        method: "post",
        data: qs.stringify(user)
    })
}

//总数
export let reqSpecsCount = () => {
    return axios({
        url: baseUrl + "/api/specscount",
        method: "get",
    })
}

//列表  size    page
export let reqSpecsList = (user) => {
    return axios({
        url: baseUrl + "/api/specslist",
        params: user

    })
}


//获取一条数据  {id:id}
export let reqSpecsDetail = (user) => {
    return axios({
        url: baseUrl + "/api/specsinfo",
        method: "get",
        params: user
    })
}

//修改  id  specsname  attrs  status
export let reqSpecsUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/specsedit",
        method: "post",
        data: qs.stringify(user)
    })
}

//删除 {id:id}
export let reqSpecsDel = (user) => {
    return axios({
        url: baseUrl + "/api/specsdelete",
        method: "post",
        data: qs.stringify(user)

    })
}


//--------------------商品管理----------------

//添加 user={}
export let reqGoodsAdd = (user) => {

    return axios({
        url: baseUrl + "/api/goodsadd",
        method: "post",
        data: dataToFormData(user)
    })
}

//列表 p={page:1,size:500}
export let reqGoodslist = (p) => {
    return axios({
        url: baseUrl + "/api/goodslist",
        params: p
    })
}

//详情 user={id:1}
export let reqGoodsDetail = (user) => {
    return axios({
        url: baseUrl + "/api/goodsinfo",
        method: "get",
        params: user
    })
}

//修改 user={id:"必填",img:file,goodsname:""}
export let reqGoodsUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/goodsedit",
        method: "post",
        data: dataToFormData(user)
    })
}

//删除 user={id:1}
export let reqGoodsDel = (user) => {
    return axios({
        url: baseUrl + "/api/goodsdelete",
        method: "post",
        data: qs.stringify(user)
    })
}

//总数
export let reqGoodsCount = () => {
    return axios({
        url: baseUrl + "/api/goodscount"
    })
}

