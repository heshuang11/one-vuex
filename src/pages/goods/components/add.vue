<template>
  <div>
    <el-dialog
      :title="info.isadd?'添加商品':'编辑商品'"
      :visible.sync="info.isshow"
      @closed="cancel"
      @opened="opened"
    >
      <!-- 2.v-model绑定user -->
      <el-form :model="user">
        <div>user:{{user}}</div>

        <el-form-item label="一级分类" label-width="100px">
          <!-- 点击一级分类要出来对应的二级分类 @change="changeFirstCateId"-->
          <el-select v-model="user.first_cateid" @change="changeFirstCateId">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="100px">
          <el-select v-model="user.second_cateid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" label-width="100px">
          <el-input v-model="user.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="100px">
          <el-input v-model="user.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" label-width="100px">
          <el-input v-model="user.market_price"></el-input>
        </el-form-item>
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
        <el-form-item label="商品规格" label-width="100px">
          <el-select v-model="user.specsid" @change="changeSpecsId">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" label-width="100px">
          <el-select v-model="user.specsattr" multiple>
            <el-option label="--请选择--" value disabled></el-option>
            <el-option v-for="item in showSpecsAttr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" label-width="100px">
          <el-radio v-model="user.isnew" :label="1">是</el-radio>
          <el-radio v-model="user.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" label-width="100px">
          <el-radio v-model="user.ishot" :label="1">是</el-radio>
          <el-radio v-model="user.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述" label-width="100px">
          <!-- 富文本编辑器 -->
          <div id="editor" v-if="info.isshow"></div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" v-if="info.isadd" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import E from "wangeditor";
import { mapActions, mapGetters } from "vuex";
import {
  reqCateList,
  reqGoodsAdd,
  reqGoodsDetail,
  reqGoodsUpdate
} from "../../../utils/http";
import { successalert ,erroralert} from "../../../utils/alert";
import path from "path";
export default {
  props: ["info"],
  data() {
    return {
      // 1.初始化数据
      user: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的是数组字符串，所以在发请求之前，需要JSON.stringify()
        isnew: 1,
        ishot: 1,
        status: 1
      },
      imgUrl: "",
      //二级分类的列表
      secondCateList: [],
      //规格属性展示的所有选项的列表(对应的规格展示对应的属性)
      showSpecsAttr: []
    };
  },
  computed: {
    //需要一级分类和二级分类的信息，
    ...mapGetters({
      //分类的list
      cateList: "cate/list",
      // 规格的list
      specsList: "specs/list"
    })
  },
  methods: {
    ...mapActions({
      //分类列表的获取
      reqCateList: "cate/reqList",
      //规格列表的获取
      reqSpecsList: "specs/reqList",
      reqList: "goods/reqList",
      reqTotal: "goods/reqTotal"
    }),
    check() {
      return new Promise(resolve => {
        if (this.user.first_cateid === "") {
          erroralert("一级分类不能为空");
          return;
        }
        if (this.user.second_cateid === "") {
          erroralert("二级分类不能为空");
          return;
        }
        if (this.user.goodsname === "") {
          erroralert("商品名称不能为空");
          return;
        }

        if (this.user.price === "") {
          erroralert("商品价格不能为空");
          return;
        }

        if (this.user.market_price === "") {
          erroralert("商品市场价格不能为空");
          return;
        }

        if (!this.user.img) {
          erroralert("请上传图片");
          return;
        }
        if (this.user.specsid === "") {
          erroralert("商品规格不能为空");
          return;
        }

        if (this.user.specsattr.length === 0) {
          erroralert("请选择规格属性");
          return;
        }
        if (this.editor.txt.html() == "") {
          erroralert("请输入商品描述");
          return;
        }
        resolve();
      });
    },
    //5.点击了一级分类，一级分类有很多，要出来对应的一级分类
    changeFirstCateId() {
      //二级分类选中的要清除
      this.user.second_cateid = "";

      this.getSecondList();
    },
    //根据一级分类得到二级分类
    getSecondList() {
      //通过接口提示的方法得到二级分类，根据一级分类得到二级分类
      reqCateList({ pid: this.user.first_cateid }).then(res => {
        if (res.data.code == 200) {
          this.secondCateList = res.data.list;
        }
      });
    },
    //点击对应的规格展示对应的属性
    changeSpecsId() {
      //将之前的规格属性清空
      //方法二  用数组的方法得到二级联动 之前是使用接口的方法，因为接口给了可以得到二级信息的属性

      //计算出规格属性展示的所有选项的列表
      //选中的规格是 user.specsid,要从specsList中取出id和user.specsid一样的那条数据的attrs
      this.user.specsattr = [];
      let obj = this.specsList.find(item => item.id === this.user.specsid);
      //找到了，返回哪条数据，没找到，返回undefined
      this.showSpecsAttr = obj ? obj.attrs : [];
      console.log(obj);
    },
    getShowSpecsAttr() {
      //选中的规格是 user.specsid,要从specsList中取出id和user.specsid一样的那条数据的attrs
      let obj = this.specsList.find(item => item.id == this.user.specsid); //找到了，返回哪条数据，没找到，返回undefined
      this.showSpecsAttr = obj ? obj.attrs : [];
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
    add() {
      this.check().then(() => {
        //取出富文本编辑器的内容，赋值给user
        this.user.description = this.editor.txt.html();

        // 由于后端要的specsattr是数组字符串，前端需要是数组，所以要拷贝、处理一下，再发送；
        // 但是由于有对象（img）,所以不能使用JSON.parse(JSON.stringify())拷贝，需要使用...
        let data = {
          ...this.user,
          //用specsattr替换this.user.specsattr
          specsattr: JSON.stringify(this.user.specsattr)
        };
        //发请求
        console.log(data);
        reqGoodsAdd(data).then(res => {
          if (res.data.code == 200) {
            console.log(res);
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //弹成功
            successalert(res.data.msg);
            //刷新list
            this.reqList();
            this.reqTotal();
          }
        });
      });
    },
    //取消
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },

    //11.清空
    empty() {
      this.user = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的是数组字符串，所以在发请求之前，需要JSON.stringify()
        isnew: 1,
        ishot: 1,
        status: 1
      };
      this.imgUrl = "";
      //二级分类的列表
      this.secondCateList = [];
      // 规格属性展示的所有选项的列表
      this.showSpecsAttr = [];
    },
    //获取一条数据
    getOne(id) {
      reqGoodsDetail({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //重新获取二级分类的list
          this.getSecondList();
          //图片 图片不能自动更新
          this.imgUrl = this.$pre + this.user.img;
          //规格属性展示list
          this.getShowSpecsAttr();
          //规格属性选中的list
          this.user.specsattr = JSON.parse(this.user.specsattr);
          //补id
          this.user.id = id;
          //将user.desctiption赋值给富文本编辑器
          if (this.editor) {
            this.editor.txt.html(this.user.description);
          }
        }
      });
    },
    //修改
    update() {
      this.check().then(()=>{
           //取出富文本编辑器的内容，赋值给user
      this.user.description = this.editor.txt.html();
      let data = {
        ...this.user,
        specsattr: JSON.stringify(this.user.specsattr)
      };

      reqGoodsUpdate(data).then(res => {
        if (res.data.code == 200) {
          //1.弹框消失
          this.cancel();
          //2.数据清空
          this.empty();
          //3.弹成功
          successalert(res.data.msg);
          //4.刷新list
          this.reqList();
        }
      });
      })
    },
    opened() {
      //创建编辑器
      this.editor = new E("#editor");
      this.editor.create();
      //赋值
      this.editor.txt.html(this.user.description);
    }
  },
  mounted() {
    //如果没有请过分类数据，就发一下请求
    if (this.cateList.length === 0) {
      this.reqCateList();
    }
    //请求规格list
    this.reqSpecsList(true);
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
