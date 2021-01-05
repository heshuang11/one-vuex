<template>
  <div>
    <el-dialog :title="info.isadd?'添加管理员':'编辑管理员'" :visible.sync="info.isshow" @closed="cancel">
      <el-form :model="user">
        <el-form-item label="所属角色" label-width="100px">
          <el-select v-model="user.roleid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :value="item.id"
              :label="item.rolename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名称" label-width="100px">
          <el-input autocomplete="off" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input autocomplete="off" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-switch :active-value="1" :inactive-value="2" v-model="user.status"></el-switch>
        </el-form-item>
      </el-form>
      {{user}}
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
  reqManageAdd,
  reqRoleList,
  reqManageUpdate,
  reqManageDetail
} from "../../../utils/http";
import { successalert, erroralert } from "../../../utils/alert";
export default {
  props: ["info", "list"],
  data() {
    return {
      user: {
        roleid: 0,
        username: "",
        password: "",
        status: 1
      },
      //角色列表
      rolelist: []
    };
  },
  methods: {
    check() {
      return new Promise(resolve => {
        if (this.user.roleid === "") {
          erroralert("所属角色不能为空");
          return;
        }
        if (this.user.username === "") {
          erroralert("用户名称不能为空");
          return;
        }
        resolve()
      });
    },
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    empty() {
      this.user = {
        roleid: "",
        username: "",
        password: "",
        status: 1
      };
    },
    add() {
      this.check().then(() => {
        // console.log(this.user);
        reqManageAdd(this.user).then(res => {
          if (res.data.code == 200) {
            // 封装了成功弹框
            successalert(res.data.msg);
            //弹框消失
            this.cancel();
            //5.清空user
            this.empty();
            //25.列表刷新
            this.$emit("init");
          }
        });
      });
    },
    //获取详情方便修改
    getOne(id) {
      reqManageDetail({ uid: id }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //密码置空
          this.user.password = "";
        }
      });
    },
    //修改了顶级菜单
    changePid() {
      if (this.user.pid == 0) {
        this.user.type = 1;
      } else {
        this.user.type = 2;
      }
    },
    //修改的
    update() {
      this.check().then(() => {
        reqManageUpdate(this.user).then(res => {
          if (res.data.code == 200) {
            //弹成功
            successalert(res.data.msg);
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //刷新list
            this.$emit("init");
          }
        });
      });
    }
  },
  mounted() {
    // 4.一进来就要获取角色列表
    reqRoleList().then(res => {
      if (res.data.code == 200) {
        this.rolelist = res.data.list;
      }
    });
  }
};
</script>

