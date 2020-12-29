<template>
  <div>
    <!-- 绑定closed -->
    <el-dialog :title="info.isadd?'添加规格':'编辑规格'" :visible.sync=" info.isshow" @closed="cancel">
      <!-- 数据绑定到页面 -->
      <div>user:{{user}}</div>
      <div>attrsArr:{{attrsA}}</div>
      <el-form>
        <el-form-item label="规格名称" label-width="100px">
          <el-input autocomplete="off" v-model="user.specsname"></el-input>
        </el-form-item>

        <el-form-item label="规格属性" label-width="100px" v-for="(item,index) in attrsA" :key="index">
          <div class="box">
            <el-input autocomplete="off" class="input" v-model="item.value"></el-input>
            <el-button type="primary" class="btn" v-if="index==0" @click="addattr">新增规格属性</el-button>
            <el-button type="danger" class="btn" v-else @click="delattr(index)">删除</el-button>
          </div>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <el-switch :active-value="1" :inactive-value="2" v-model="user.status"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isadd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  reqSpecsAdd,
  reqSpecsDetail,
  reqSpecsUpdate
} from "../../../utils/http";
import { mapActions, mapGetters } from "vuex";
import { successalert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      //初始化数据
      user: {
        specsname: "",
        attrs: "[]",
        status: 1
      },
      //定义一个变量，来放属性的，就是点击新增属性下面会多出来点击的属性  是一个数组
      attrsA: [{ value: "" }]
    };
  },
  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqTotal: "specs/reqTotal"
    }),
    //清空
    empty() {
      this.user = {
        specsname: "",
        attrs: "[]",
        status: 1
      };
      this.attrsA = [{ value: "" }];
    },
    //点击新增规格
    addattr() {
      this.attrsA.push({ value: "" });
    },
    //点击新增规格下面的删除
    delattr(index) {
      this.attrsA.splice(index, 1);
    },
    //点击添加，添加到列表
    add() {
      //attrsArr:[ { "value": "s" }, { "value": "m" }, { "value": "l" } ]
      //user.attrs='["s","m","l"]'  格式不一样
      this.user.attrs = JSON.stringify(this.attrsA.map(item => item.value));
      reqSpecsAdd(this.user).then(res => {
        if (res.data.code == 200) {
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //成功
          successalert(res.data.msg);
          //刷新list

          this.reqList();
          //获取总数
          this.reqTotal();
        }
      });
    },
    //点击修改
    update() {
      //属性的数据需要再转化成字符串
      this.user.attrs = JSON.stringify(this.attrsA.map(item => item.value));
      reqSpecsUpdate(this.user).then(res => {
        if (res.data.code == 200) {
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          successalert(res.data.msg);
          //刷新list
          this.reqList();
        }
      });
    },
    //点击取消
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    getOne(id) {
      reqSpecsDetail({ id: id }).then(res => {
        //后台的需要的数据是js对象  ,  前端需要的数据是数组
        if (res.data.code == 200) {
          //从后台得到的js对象
          this.user = res.data.list[0];
          //转化成数组
          this.user.attrs = JSON.parse(this.user.attrs);
          //遍历一下给attrsA
          this.attrsA = this.user.attrs.map(item => ({ value: item }));
        }
      });
    }
  }
};
</script>
<style  scoped>
.box {
  display: flex;
}
.btn {
  width: auto;
}
.input {
  flex: 1;
}
</style>