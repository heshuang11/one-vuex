<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <v-list :list="list" @edit="edit($event)" @init="init"></v-list>
    <v-add :info="info" @init="init" :list="list" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";
import { reqBannerList } from "../../utils/http";
export default {
  components: {
    vList,
    vAdd
  },
  data() {
    return {
      info: {
        isshow: false,
        isadd: true
      },
      list: []
    };
  },
  methods: {
    willAdd() {
      this.info.isshow = true;
      this.info.isadd = true;
    },
    init() {
      reqBannerList().then(res => {
        if (res.data.code == 200) {
          this.list = res.data.list;
          // console.log(this.list);
        }
      });
    },
    edit(id) {
      this.info.isshow = true;
      //是编辑
      this.info.isadd = false;
      //触发add的getOne()
      this.$refs.add.getOne(id);
    }
  },
   mounted() {
      //触发列表
      this.init();
    },
};
</script>

<style scope>
div {
  margin-top: 20px;
}
img {
  width: 100px;
}
</style>