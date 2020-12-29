<template>
  <div>
    <!-- 绑定closed -->
    <el-dialog :title="info.isadd?'添加轮播图':'编辑轮播图'" :visible.sync=" info.isshow">
      <!-- 数据绑定到页面 -->
      {{user}}
      <el-form>
        <el-form-item label="轮播图标题" label-width="100px">
          <el-input autocomplete="off" v-model="user.title"></el-input>
        </el-form-item>

        <!-- 不是顶级菜单的都有图片 v-if="user.pid!==0"是二级分类才有图片-->
        <el-form-item label="图片" label-width="100px">
          <!-- element-ui上传文件 -->
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeImg"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <el-switch :active-value="1" :inactive-value="2" v-model="user.status"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isadd">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqBannerAdd,
  reqBannerDetail,
  reqBannerUpdate
} from "../../../utils/http";
import { successalert, erroralert } from "../../../utils/alert";
import path from "path";
export default {
  props: ["info", "list"],
  data() {
    return {
      imgUrl: "",
      user: {
        title: "",
        img: null,
        status: 1
      }
    };
  },
  methods: {
    check() {
      return new Promise(resolve => {
        if (this.user.title === "") {
          erroralert("一级分类不能为空");
          return;
        }
        if (this.user.img === null) {
          erroralert("图片不能为空");
          return;
        }
      });
    },
    empty() {
      this.imgUrl = "";
      this.user = {
        pid: "",
        catename: "",
        img: null,
        status: 1
      };
    },
    cancel() {
      //编辑清空数据
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    add() {
      this.check().then(() => {
        reqBannerAdd(this.user).then(res => {
          if (res.data.code == 200) {
            //成功弹框
            successalert(res.data.msg);
            this.info.isshow = false;
            this.cancel();
            //列表更新
            this.$emit("init");
          }
        });
      });
    },

    //图片上传时触发的，element里面自带的方法
    changeImg(e) {
      let file = e.raw;

      //判断文件大小的
      if (file.size > 2 * 1024 * 1024) {
        erroralert("文件大小不能超过2M");
        return;
      }
      //判断后缀是不是图片
      let ext = path.extname(file.name);
      let arr = [".png", ".gif", ".jpg", ".jpeg"];
      if (!arr.some(item => item === ext)) {
        erroralert("请上传图片");
        return;
      }

      // 将文件生成一个url地址
      this.imgUrl = URL.createObjectURL(file);
      //赋值给user.img
      this.user.img = file;
    },
    getOne(id) {
      reqBannerDetail({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //补id
          this.user.id = id;
          //处理图片 图片不能自动更新
          this.imgUrl = this.$pre + this.user.img;
          console.log(11);
        }
      });
    },
    update() {
      this.check().then(() => {
        reqBannerUpdate(this.user).then(res => {
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