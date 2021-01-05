<template>
  <div>
    <!-- 绑定closed -->
    <el-dialog title="会员修改" :visible.sync=" info.isshow">
      <!-- 数据绑定到页面 -->
      {{user}}
      <el-form>
        <el-form-item label="手机号" label-width="100px">
          <el-input autocomplete="off" v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="100px">
          <el-input autocomplete="off" v-model="user.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input autocomplete="off" v-model="user.password"></el-input>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <el-switch :active-value="1" :inactive-value="2" v-model="user.status"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqMemberDetail, reqMemberUpdate } from "../../../utils/http";
import { successalert,erroralert } from "../../../utils/alert";
export default {
  props: ["info", "list"],
  data() {
    return {
      user: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1
      }
    };
  },
  methods: {
    empty() {
      this.user = {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1
      };
    },
    check() {
      return new Promise(resolve => {
        if (this.user.phone === "") {
          erroralert("一级分类不能为空");
          return;
        }
        if (this.user.nickname === "") {
          erroralert("昵称不能为空");
          return;
        }
        if (this.user.password === "") {
          erroralert("密码不能为空");
          return;
        }
        resolve();
      });
    },
    cancel() {
      this.empty();
      this.info.isshow = false;
    },
    getOne(uid) {
      reqMemberDetail({ uid: uid }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //补id
          this.user.uid = uid;
        }
      });
    },
    update() {
      this.check().then(() => {
        reqMemberUpdate(this.user).then(res => {
          if (res.data.code == 200) {
            successalert(res.data.msg);
            this.cancel();
            this.empty();
            //刷新list
            this.$emit("init");
          }
        });
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.form >>>.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>