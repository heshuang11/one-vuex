<template>
 <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 拆分展示表单 -->
   <v-list :list="list" @init="init" @edit="edit"></v-list>
   <!-- 拆分添加弹框 -->
   <v-add :info="info" @init="init" :menulist="menulist" ref="add"></v-add>
 </div>
</template>

<script>
import vList from "./components/list.vue"
import vAdd from  "./components/add.vue"
import { reqRoleList, reqMenuList } from '../../utils/http'
export default {
  components:{
    vAdd,
    vList
  },
  data(){
    return{
      info:{
          isshow:false,
          //判断编辑还是添加
          isadd:true
      },
      //初始化列表数据
      menulist:[],
      list:[]
    }
  },
  methods:{
     willAdd(){
        this.info.isshow=true
        this.info.isadd=true
     },
     init(id){
       reqRoleList(id).then(res=>{
         if(res.data.code==200){
         this.list=res.data.list
      }
       })
     },
     edit(id){
       //弹框要出来  list的编辑触发的
        this.info.isshow = true;
        this.info.isadd = false;
        //弹框出来的同时该条数据的信息要显示在弹框中 触发add 的getOne
        this.$refs.add.getOne(id);
     },
     //获取列表信息
     listmessage(){
        reqMenuList().then(res=>{
            if(res.data.code==200){
                this.menulist=res.data.list
            }
        })
     }
  },
  mounted(){
    this.init()
    this.listmessage()
  }
}
</script>

<style scoped>
div {
  margin-top: 20px;
}
</style>