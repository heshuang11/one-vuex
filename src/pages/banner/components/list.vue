<template>
  <el-table
    :data="list"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border
    :tree-props="{children: 'children'}"
  >
    <el-table-column prop="id" label="编号" sortable width="180"></el-table-column>
    <el-table-column prop="title" label="轮播图标题" sortable width="180"></el-table-column>
    <el-table-column prop="url" label="图片">
      <template slot-scope="scope">
        <img v-if="scope.row.img!=='null'" :src="$pre+scope.row.img" alt />
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
import {reqBannerDel} from "../../../utils/http"
import {successalert} from "../../../utils/alert"
export default {
  props: ["list"],
  methods: {
    edit(id) {
      this.$emit("edit", id);
    },
    del(id) {
      reqBannerDel({ id: id }).then(res => {
        if (res.data.code == 200) {
          successalert(res.data.msg);
          this.$emit("init");
        }
      });
    }
  }
};
</script>

<style>
</style>