<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-list  @edit="edit($event)"></v-list>
    <v-add :info="info" ref="add"></v-add>
  </div>
</template>

<script>
import vAdd from "./components/add.vue";
import vList from "./components/list.vue";
// import { reqCateList } from '../../utils/http';

export default {
  data() {
    return {
      info: {
        isshow: false,
        isadd : true
      },
      list:[]
    };
  },
  components: {
    vAdd,
    vList
  },
  methods: {
    //点击添加
    willAdd() {
      this.info.isshow = true;
      this.info.isadd = true;
    },
    //获取列表信息
    // init(){
    //   reqCateList({istree:true}).then(res=>{
    //     if (res.data.code == 200) {
    //       this.list = res.data.list;
    //     }
    //   })
    // },
    edit(id){
      this.info.isshow=true;
      //是编辑
      this.info.isadd=false;
      //触发add的getOne()
      this.$refs.add.getOne(id)
    }
  },
  mounted(){
    
  }
};
</script>

<style scope>
div {
  margin-top: 20px;
}
</style>