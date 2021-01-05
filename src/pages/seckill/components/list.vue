<template>
  <div>
       <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
    >
      <el-table-column prop="title" label="活动名称" sortable width="180"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- slot-scope="scope" -->
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
  <script>
import { mapActions, mapGetters } from "vuex";
import {successalert} from "../../../utils/alert"
import { reqSeckillDel} from "../../../utils/http"
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "seckill/list"
    })
  },
  methods: {
    ...mapActions({
      reqList: "seckill/reqList"
    }),
    edit(id){
         this.$emit("edit",id)
    },
    del(id){
        reqSeckillDel({id:id}).then(res=>{
            if (res.data.code == 200) {
            successalert(res.data.msg);
            this.reqList();
        }
        })
    },
  },
  mounted(){
      this.reqList()
  }
};
</script>

  <style scoped>
</style>