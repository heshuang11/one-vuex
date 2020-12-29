<template>
  <div>
    <el-dialog :title="info.isadd?'角色添加':'角色编辑'" :visible.sync="info.isshow" @closed="cancel">
      <el-form>
        <!-- :model="form" -->
        <el-form-item label="角色名称">
          <el-input autocomplete="off" v-model="user.rolename"></el-input>
        </el-form-item>

        <el-form-item label="角色权限" label-width="100px">
          <!-- 树形控件 
          data：展示的数据 
          show-checkbox：展示选择框
          node-key:每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
          default-expanded-keys :默认展开
          default-checked-keys：默认选中
          :props="{children: '用来判断有没有下一个子节点的字段',label: '展示的内容的字段'}"
          this.$refs.tree.getCheckedNodes() 取到选中的数据的所有信息
          this.$refs.tree.getCheckedKeys() 取到选中的数据的node-key拼成的数组
          -->
          <el-tree :data="menulist" show-checkbox node-key="id" ref="tree" :props="defaultProps"></el-tree>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <el-switch :active-value="1" :inactive-value="2" v-model="user.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add" v-if="info.isadd">添 加</el-button>
        <el-button type="primary" @click="xiu" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reqRoleAdd, reqRoleHuo, reqRoleUpdate } from "../../../utils/http";
import { successalert } from "../../../utils/alert";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["info", "menulist"],
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "title"
      },
      //看项目文件写需要的字段和每个字段的类型
      user: {
        rolename: "",
        menus: "",
        status: 1
      }
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo"
    })
  },
  methods: {
    cancel() {
      //45.编辑清空数据
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    ...mapActions({
      changeUser: "changeUser"
    }),
    empty() {
      this.user = {
        rolename: "",
        menus: [],
        status: 1
      };
      //树形控件要清空数据
      this.$refs.tree.setCheckedKeys([]);
    },
    add() {
      /*
      user的rolename、status是和表单关联的，所以这两个字段不用操作；
      但是menus和树形控件没有关联，在发起请求之前，需要将树形控件上选中的内容赋值给menus，
      再发请求。*/
      this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());

      reqRoleAdd(this.user).then(res => {
        if (res.data.code == 200) {
          //成功弹框
          successalert(res.data.msg);
          //弹框消失
          this.cancel();
          //清空数据
          this.empty();
          //列表更新
          this.$emit("init");
        }
      });
    },
    //获取数据
    getOne(id) {
      reqRoleHuo({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          this.user.id = id;
          //给树形控件赋值
          this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus));
        }
      });
    },
    xiu() {
      //先取出树形控件的数据给menus，再发请求
      this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleUpdate(this.user).then(res => {
        if (res.data.code == 200) {
          //弹成功
          successalert(res.data.msg);
          //弹框消失

          //修改的角色是当前用户所属的角色，就需要退出
          if (this.user.id == this.userInfo.roleid) {
            this.changeUser({});
            this.$router.push("/login");
            return;
          }

          this.cancel();
          //数据清空
          this.empty();
          //刷新list
          this.$emit("init");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>