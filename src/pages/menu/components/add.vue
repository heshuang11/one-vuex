<template>
  <div>
    <!-- Dialog的closed方法是 关闭动画结束时的回调 -->
    <el-dialog :title="info.isadd?'添加菜单':'编辑菜单'" :visible.sync="info.isshow" @closed="cancel">
      <el-form :model="user">
        <el-form-item label="菜单名称" label-width="100px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" label-width="100px">
          <el-select v-model="user.pid" @change="changePid">
            <el-option :value="0" label="顶级菜单">顶级菜单</el-option>
            <!-- 需要数据 -->
            <el-option v-for="item in list" :key="item.tilte" :value="item.id" :label="item.title"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" label-width="100px">
          <el-radio v-model="user.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="user.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <el-form-item label="菜单图标" label-width="100px" v-if="user.type==1">
          <!-- 数据库里面还没有图标，绑定数据库是为了给数据库传图标，<i :class="item"></i>得到的是图标的图片，可是数据库要图标的类名，要通过value值得到类名  :value="item"  展示的是小图标，数据库要得到的是图标的类名 -->
          <el-select v-model="user.icon">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址" label-width="100px" v-else>
          <el-select v-model="user.url">
            <el-option
              v-for="item in indexRoutes"
              :key="item.path"
              :value="'/'+item.path"
              :label="item.name+'-/'+item.path"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- {{user}}  测试一下 -->
        <el-form-item label="状态" label-width="100px">
          <!-- el-switch 自带的属性 激活时active-value="1" 未激活时:inactive-value="2" -->
          <el-switch v-model="user.status" active-value="1" :inactive-value="2"></el-switch>
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
import { indexRoutes } from "../../../router";
import { reqMenuAdd, reqMenuDetail, reqMenuUpdate } from "../../../utils/http";
import { successalert,erroralert } from "../../../utils/alert";
export default {
  props: ["info", "list"],
  data() {
    return {
      //看项目文件写需要的字段和每个字段的类型
      user: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1
      },
      //icon图标集合
      icons: [
        "el-icon-setting",
        "el-icon-user-solid",
        "el-icon-camera-solid",
        "el-icon-s-platform",
        "el-icon-s-order"
      ],
      //路由集合
      indexRoutes
    };
  },
  methods: {
    check() {
      return new Promise(resolve => {
        if (this.user.title === "") {
          erroralert("一级分类不能为空");
          return;
        }
        resolve();
      });
    },
    //点击取消
    cancel() {
      //如果是添加，点了取消，再点添加之前输的数据不清空，如果是点击编辑，然后点击取消，再点击添加的话，就会有一个bug,编辑的数据还在，所以要清空
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //清空
    empty() {
      this.user = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1
      };
    },
    //点击添加，添加数据
    add() {
      this.check().then(() => {
        //  什么时候封装函数，什么时候创建公共组件   很多地方只用到方法的时候封装函数，如果很多地方不仅需要方法还需要标签的话，创建公共组件

        reqMenuAdd(this.user).then(res => {
          //封装了成功弹框
          if (res.data.code == 200) {
            successalert(res.data.msg);
            //弹框消失
            this.cancel();
            //清空user
            this.empty();
          }
          //列表刷新
          this.$emit("init");
        });
      });
    },
    changePid() {
      if (this.user.pid == 0) {
        this.user.type = 1;
      } else {
        this.user.type = 2;
      }
    },
    //获取要编辑的那一条的数据
    getOne(id) {
      reqMenuDetail({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //补id 要确定修改的是哪一条数据
          this.user.id = id;
        }
      });
    },
    //修改
    update() {
      this.check().then(() => {
        reqMenuUpdate(this.user).then(res => {
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
  }
};
</script>

<style>
</style>