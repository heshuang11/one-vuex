<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-list :init="init" :list="list" @edit="edit"></v-list>
    <v-add :info="info"  @init="init" ref='add' :list="list"></v-add>
     <!-- 一、分页
    prev表示上一页，
    next为下一页，
    pager表示页码列表
    total表示总条目数，默认一页10条
    page-size 每一页的数量
    current-change	currentPage 改变时会触发
     -->

     <!-- 通过接口文件可以得到total 总数, :page-size 是一页的个数，自己设置，当前页改变时触发了:page-size  在这个方法中写需要的逻辑  里面需要改现在所在的页 也就是  当前页page 然后从新获取列表信息   -->
     
     <el-pagination layout="prev, pager, next" :total="total" :page-size="pageSize"
     @current-change="changePage"></el-pagination>
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";
import { reqManageList, pages } from "../../utils/http";
export default {
  components: {
    vList,
    vAdd
  },
  data() {
    return {
      info: {
        isshow: false,
        isadd:true
      },
      list: [],
      //总数
      total: 0,
      // 当前页
      page:1,
      // 一页的个数
      pageSize:2
    };
  },
  methods: {
    willAdd() {
      this.info.isshow = true;
      this.info.isadd = true
    },
    //获取列表信息
    getList(){
        reqManageList({page:this.page,size:this.pageSize}).then(res => {
        if (res.data.code == 200) {
            /*
          如果删除了最后一页的最后一条，那么当前页就会取到空数组；
          这个时候如果有上一页的话，就应该取上一页
          */
          if(res.data.list.length==0&&this.page>1){
            this.page--
            this.getList()
            return
          }
        }
        this.list = res.data.list;
      });
    },
    init(){
       this.getList();
       this.fenye();
    },
    //总数
    fenye(){
      pages().then(res => {
        //  console.log(res);
        if(res.data.code==200){
          this.total=res.data.list[0].total
        }
      });
    },
    changePage(e){
      this.page=e;
      this.getList()
    },
    //编辑的
    edit(id){
        this.info.isshow = true;
        this.info.isadd=false
        this.$refs.add.getOne(id);
    }
  },
  mounted() {
    this.init()
  }
};
</script>

<style scoped>
div {
  margin-top: 20px;
}
</style>