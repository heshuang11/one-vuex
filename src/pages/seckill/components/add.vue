<template>
  <div>
    <div>
      <!-- 绑定closed -->
      <el-dialog :title="info.isadd?'活动添加':'活动编辑'" :visible.sync=" info.isshow" @closed="cancel">
        <!-- 数据绑定到页面 -->
        <div>{{user}}</div>
        <!-- <div>attrsArr:{{attrsA}}</div> -->
        <el-form>
          <el-form-item label="活动名称" label-width="100px">
            <el-input autocomplete="off" v-model="user.title"></el-input>
          </el-form-item>
          <div class="block">
            <span class="demonstration">活动期限</span>
            <!-- value-format="timestamp"  自动将字符串转化成时间戳 -->
            <el-date-picker
              v-model="time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="timestamp"
            ></el-date-picker>
          </div>

          <el-form-item label="一级分类" label-width="100px">
            <el-select v-model="user.first_cateid" @change="firstid">
              <el-option :value="0" label="请选择"></el-option>
              <!-- 需要数据 -->
              <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.catename"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类" label-width="100px">
            <el-select v-model="user.second_cateid" @change="secondid">
              <el-option :value="0" label="请选择"></el-option>
              <!-- 需要数据 -->
              <el-option
                v-for="item in secondCated"
                :key="item.id"
                :label="item.catename"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品" label-width="100px">
            <el-select v-model="user.goodsid">
              <el-option :value="0" label="请选择"></el-option>
              <!-- 需要数据 -->
              <el-option
                v-for="item in  thirdCated"
                :key="item.id"
                :label="item.goodsname"
                :value="item.id"
              ></el-option>
            </el-select>
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
  </div>
</template>
  <script>
import { mapActions, mapGetters } from "vuex";
import {
  reqCateList,
  reqGoodslist,
  reqSeckillAdd,
  reqSeckillDetail,
  reqSeckillUpdate
} from "../../../utils/http";
import { successalert, erroralert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      time: [],
      user: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      },
      secondCated: [],
      thirdCated: []
    };
  },
  computed: {
    ...mapGetters({
      list: "cate/list",
      goods: "goods/list",
      seckill: "seckill/list"
    })
  },
  methods: {
    ...mapActions({
      //分类列表的获取
      reqCateList: "cate/reqList",
      //商品列表的获取
      reqGoodslist: "goods/reqList",
      reqSeckilllist: "seckill/reqList"
    }),
    check() {
      return new Promise(resolve => {
        if (this.user.title === "") {
          erroralert("活动名称不能为空");
          return;
        }
        if (this.user.first_cateid === "") {
          erroralert("一级分类不能为空");
          return;
        }
        if (this.user.second_cateid === "") {
          erroralert("二级分类不能为空");
          return;
        }
        if (this.user.goodsid === "") {
          erroralert("商品不能为空");
          return;
        }
        resolve();
      });
    },
    add() {
      this.check().then(() => {
        //时间time绑定的弹框里面的时间，所以time里面的数据是字符串，this.user.begintime是后端要的数据，要时间戳，所以需要转换
        this.user.begintime = new Date(this.time[0].getTime());
        this.user.endtime = new Date(this.time[1].getTime());
        reqSeckillAdd(this.user).then(res => {
          if (res.data.code == 200) {
            this.cancel();
            this.empty();
            successalert(res.data.msg);
            //刷新秒杀列表
            this.reqSeckilllist();
          }
        });
      });
    },
    getOne(id) {
      reqSeckillDetail({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //重新获取二级信息
          this.getSecondList();
          //重新获取三级信息
          this.getThirdList();
          // console.log(this.user);
          //补id
          this.user.id = id;
          this.time.push(new Date(+this.user.begintime));
          this.time.push(new Date(+this.user.endtime));
        }
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
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      };
      this.secondCated = [];
      this.time = [];
      this.thirdCated = [];
    },
    update() {
      this.check().then(() => {
        //因为getOne里面重新修改了时间的数据，所以将time 里面的时间（他里面的是字符串）重新赋给 this.user.begintime，  <!-- value-format="timestamp"  自动将字符串转化成时间戳 -->
        this.user.begintime = this.time[0];
        this.user.endtime = this.time[1];
        reqSeckillUpdate(this.user).then(res => {
          if (res.data.code == 200) {
            //1.弹框消失
            this.cancel();
            //2.数据清空
            this.empty();
            //3.弹成功
            successalert(res.data.msg);
            //4.刷新list
            this.reqSeckilllist();
          }
        });
      });
    },
    //一级分类 ( 三级联动)
    firstid() {
      //二级分类清空
      this.user.second_cateid = "";
      //商品清空
      this.getSecondList();
    },
    //获取二级的信息
    getSecondList() {
      reqCateList({ pid: this.user.first_cateid }).then(res => {
        if (res.data.code == 200) {
          this.secondCated = res.data.list;
          console.log(this.secondCated);
        }
      });
    },
    secondid() {
      //商品清空
      this.user.goodsid = "";
      this.getThirdList();
    },
    //获取商品列表的信息
    getThirdList() {
      // {fid:this.user.first_cateid,sid:this.user.second_cateid} 接口的方式
      reqGoodslist({
        fid: this.user.first_cateid,
        sid: this.user.second_cateid
      }).then(res => {
        if (res.data.code == 200) {
          this.thirdCated = res.data.list;
          //方法二  数组的方法得到的
          // let obj = res.data.list;
          // obj.forEach(item => {
          //   if (item.second_cateid == this.user.second_cateid) {
          //     this.thirdCated.push(item);
          //   }
          // });
          console.log(this.thirdCated);
        }
      });
    }
  },
  mounted() {
    //通过接口提示的方法得到二级分类,所有需要写接口，如果没有请过分类数据，就发一下请求
    if (this.list.length === 0) {
      this.reqCateList();
    }
  }
};
</script>

  <style scoped>
.block {
  margin-bottom: 25px;
  margin-left: 40px;
}
</style>