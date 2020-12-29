<template>
  <div>
    <el-container class="box">
      <el-aside width="200px">
        <!-- 侧边栏 -->
        <!-- background-color 背景色
        text-color 文字的颜色
        active-text-color 激活的时候文字的颜色
        unique-opened	是否只保持一个子菜单的展开
        router 开启路由模式，index就是配置path 例：index="/"-->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#20222a"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <div v-for="item in userInfo.menus" :key="item.id">
            <!-- 单纯是菜单 没有下一级-->
            <el-menu-item v-if="!item.children" :index="item.url">{{item.tilte}}</el-menu-item>
            <!-- slot="title" 具名插槽 66页-->
            <!-- 有目录，有菜单 -->
            <el-submenu :index="item.id+''" v-if="item.children">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="i in item.children" :key="i.id" :index="i.url">{{i.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>
      <!-- 右侧上面和下面 -->
      <el-container>
        <el-header>
          <span>{{userInfo.username}}</span>
          <el-button type="danger" @click="logout" class="btn">退出登录</el-button>
        </el-header>

        <el-main>
          <!-- 面包屑 -->
          <el-breadcrumb separator="/" v-if="$route.name">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
              <a href="/">{{$route.name}}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 要在main 里面显示内容及二级路由 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>



<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      userInfo: "userInfo"
    })
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser"
    }),
    //退出登录
    logout() {
      this.changeUser({});
      this.$router.replace("/login");
    }
  },
  mounted() {}
};
</script>

<style scoped>
.box {
  height: 100vh;
}
.el-aside {
  background: #20222a;
}
.el-header {
  background: #b3c0d1;
}
.el-header .btn {
  margin-left: 1000px;
  margin-top: -5px;
}
a {
  color: #fff;
  text-decoration: none;
  margin-left: 60px;
}
</style>