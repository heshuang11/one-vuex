<template>
  <el-table
    :data="list"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border
    :tree-props="{children: 'children'}"
  >
    <el-table-column prop="id" label="用户编号" sortable width="180"></el-table-column>
    <el-table-column prop="nickname" label="昵称" sortable width="180"></el-table-column>
    <el-table-column prop="phone" label="手机号" sortable width="180"></el-table-column>
    

    <el-table-column label="状态">
      <template slot-scope="scope">
        <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
        <el-button type="info" v-else>禁用</el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  props: ["list"],
  methods: {
    edit(a) {
      console.log(a);
      this.$emit("edit", a);
    },
  }
};
</script>

<style>
</style>