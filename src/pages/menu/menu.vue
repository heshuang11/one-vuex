<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 拆分展示表单 -->
    <v-list :list="list" @edit="edit" @init="init"></v-list>
    <!-- 拆分添加弹框 -->
    <v-add :info="info" @init="init" :list="list" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";
import {reqMenuList} from '../../utils/http';
export default {
  data() {
    return {
       //isshow 这个变量子组件和父组件都用到，点击添加isshow为true,子组件添加完成后，点击确定再消失，子不好修改父的值，所以放在父组件中  子要直接修改父的值得话，父传jaon 形式的值就可以解决
      info: {
        isshow: false,
        //用来判断是添加还是编辑打开的摊弹框
        isadd:true
      },
      //列表的数据放父里面，这样便于得到子的值（父得子的值比较方便）
      list:[]
    };
  },
  components: {
    vList,
    vAdd
  },
  methods:{
     willAdd(){
        this.info.isshow=true
        this.info.isadd=true
     },
     edit(id){
        //弹框要出来  list的编辑触发的
        this.info.isshow = true;
        this.info.isadd = false;
        //弹框出来的同时该条数据的信息要显示在弹框中 触发add 的getOne
        this.$refs.add.getOne(id);

     },
    //  获取列表
    init(){
      reqMenuList().then(res=>{
        if(res.data.code == 200){
          this.list=res.data.list
        }
      })
    }
  },
  mounted(){
    this.init();
  }
};
</script>

<style scoped>
div {
  margin-top: 20px;
}
</style>