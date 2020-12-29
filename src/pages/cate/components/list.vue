<template>
  <el-table
    :data="list"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border
    :tree-props="{children: 'children'}"
  >
    <el-table-column prop="id" label="分类编号" sortable width="180"></el-table-column>
    <el-table-column prop="catename" label="分类名称" sortable width="180"></el-table-column>
    <el-table-column prop="url" label="图片">
      <template slot-scope="scope">
        <img v-if="scope.row.img!=='null'" :src="$pre+scope.row.img" alt="">
      </template>
    </el-table-column>

    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
        <el-button type="info" v-else>禁用</el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <!-- slot-scope="scope" -->
        <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
        <del-btn @confirm="del(scope.row.id)"></del-btn>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {reqCateDel} from "../../../utils/http"
import {successalert} from "../../../utils/alert"
import {mapGetters,mapActions} from "vuex"
export default {
   computed:{ 
      ...mapGetters({
        "list":"cate/list"
      })
  },
  methods: {
     ...mapActions({
        "reqList":"cate/reqList"
    }),

    del(id) {
      reqCateDel({ id: id }).then(res => {
        if (res.data.code == 200) {
          successalert(res.data.msg);
          // this.$emit("init");
          this.reqList()
        }
      });
    },
    edit(id){
        this.$emit("edit", id);
    },
  },
  mounted(){
    //一进来就发请求
    this.reqList();
  }
};
</script>

<style scope>
img {
  width: 100px;
  height: 100px;
}
</style>