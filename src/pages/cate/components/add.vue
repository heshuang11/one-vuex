<template>
  <div>
    <!-- 绑定closed -->
    <el-dialog :title="info.isadd?'添加分类':'编辑分类'" :visible.sync=" info.isshow" @closed="cancel">
      <!-- 数据绑定到页面 -->
      {{user}}
      <el-form :model="user">
        <el-form-item label="上级分类" label-width="100px">
          <el-select v-model="user.pid">
            <el-option :value="0" label="顶级分类"></el-option>
            <!-- 需要数据 -->
            <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.catename"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类名称" label-width="100px">
          <el-input autocomplete="off" v-model="user.catename"></el-input>
        </el-form-item>
        <!-- 不是顶级菜单的都有图片 v-if="user.pid!==0"是二级分类才有图片-->
        <el-form-item label="图片" label-width="100px" v-if="user.pid!==0">
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
import { reqCateAdd, reqCateInfo, reqCateEdit } from "../../../utils/http";
import { successalert, erroralert } from "../../../utils/alert";
import path from "path";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "cate/list"
    })
  },
  data() {
    return {
      //图片地址
      imgUrl: "",
      //初始化
      user: {
        pid: "",
        catename: "",
        img: null,
        status: 1
      }
    };
  },
  methods: {
    check() {
      return new Promise(resolve => {
        if (this.user.pid === "") {
          erroralert("上级分类不能为空");
          return;
        }
        if (this.user.catename === "") {
          erroralert("分类名称不能为空");
          return;
        }
        resolve()
      });
    },
    ...mapActions({
      reqList: "cate/reqList"
    }),
    //消失
    cancel() {
      //清空数据
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //清空
    empty() {
      //图片另外清空
      this.imgUrl = "";
      this.user = {
        pid: "",
        catename: "",
        img: null,
        status: 1
      };
    },
    //添加
    add() {
      this.check().then(() => {
        reqCateAdd(this.user).then(res => {
          if (res.data.code == 200) {
            successalert(res.data.msg);
            //模板消失
            this.cancel();
            //清空
            this.empty();
            //列表更新
            // this.$emit("init");
            this.reqList();
          }
        });
      });
    },
    // 上传图片的时候触发的
    changeImg(e) {
      let file = e.raw;

      //    判断文件大小的
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
      //img 这个是单项的，上传的时候图片变了，但是数据库里面没有变，所以要创建一个变量，放图片的，然后把放图片的变量在赋给数据库里面对应的字段
      // 将文件生成一个url地址
      this.imgUrl = URL.createObjectURL(file);

      //赋值给user.img
      this.user.img = file;
    },
    getOne(id) {
      //  console.log(11);
      reqCateInfo({ id: id }).then(res => {
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
        reqCateEdit(this.user).then(res => {
          if (res.data.code == 200) {
            successalert(res.data.msg);
            this.cancel();
            this.empty();
            //刷新list
            // this.$emit("init");
            this.reqList();
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
</style>>
