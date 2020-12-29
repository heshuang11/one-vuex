<template>
  <div>
    <v-list :list="list" @edit="edit($event)" @init="init"></v-list>
    <v-add :info="info" @init="init" :list="list" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";
import { reqMemberList } from "../../utils/http";
export default {
  components: {
    vList,
    vAdd
  },
  data() {
    return {
      info: {
        isshow: false,
      },
      list: []
    };
  },
  methods: {
    init() {
      reqMemberList().then(res => {
        if (res.data.code == 200) {
          this.list = res.data.list;
          // console.log(this.list);
        }
      });
    },
    edit(uid) {
      this.info.isshow = true;
      //触发add的getOne()
      this.$refs.add.getOne(uid);
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