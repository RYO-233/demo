<template>
  <div class="detail-container">
    <div class="page-head">
      <div class="tit">软件异常反馈详情</div>
      <div class="charges">
        <el-button size="small" type="primary" plain 
          v-show="obj.status === 'todo'"
          @click="handleUpdate" v-hasPermi="['srhjjg:mpFeedback:edit']">处理</el-button>
        <el-button size="small" type="primary" plain @click="back">返回</el-button>
      </div>
    </div>
    <blScrollContent>
      <div class="info">
        <div class="block">
          <div class="info-item">
            <span>反馈的异常：</span>{{ obj.title }}
          </div>
          <div class="info-item">
            <span>反馈人姓名：</span>{{ obj.user?obj.user.realName:'' }}
          </div>
          <div class="info-item"><span>反馈人手机号：</span>{{ obj.user?obj.user.phonenumber:'' }}</div>
          <div class="info-item"><span>反馈时间：</span>{{ obj.feedbackDate }}</div>
          <div class="info-item">
            <span>回复状态：</span>
              <template v-if="obj.status === 'todo'">
                未处理
              </template>
              <template v-if="obj.status === 'done'">
                已回复
              </template>
          </div>
        </div>
        <div class="block">
          <div class="info-item">
            <span>反馈详情：</span>
            <el-input v-model="obj.description" type="textarea" disabled
            :autosize="{ minRows: 4}"/>
          </div>
          <div class="info-item">
          </div>
          <div class="info-item flex">
            <span>反馈图片：</span>
            <div class="imgList-wrap">
              <blImageList :imgList="obj.img"></blImageList>
            </div>
          </div>
        </div>
      </div>
    </blScrollContent>

    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal=false append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" label-position="top">
        <el-form-item label="反馈的异常">
          {{ form.title }}
        </el-form-item>
        <el-form-item label="反馈人姓名">
          {{ form.user?form.user.realName:'' }}
        </el-form-item>
        <el-form-item label="反馈人手机号">
          {{ form.user.phonenumber }}
        </el-form-item>
        <el-form-item label="回复内容" prop="result">
          <el-input v-model="form.result" type="textarea" placeholder="请输入内容" 
            :autosize="{ minRows: 4}"
            maxlength="300" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import blImageList from "@/components/blade/bl-image-list";
import blScrollContent from "@/components/blade/bl-scroll-content"
import { listMpFeedback, getMpFeedback, delMpFeedback, addMpFeedback, updateMpFeedback } from "@/api/srhjjg/mpFeedback";
export default {
  props: {},
  dicts: [],
  components: { blImageList, blScrollContent },
  data() {
    return {
      id: null,
      obj: {},

      title: "",
      // 是否显示弹出层
      open: false,
      form: {
        user: {
          realName: null,
          phonenumber: null
        }
      },
      rules: {
        result: [
          { required: true, message: "回复内容不能为空", trigger: "blur" },
          { max: 300, message: '长度不得超过300', trigger: 'blur' },
        ],
      }
    };
  },
  created() { },
  mounted() {
    const id = this.$route.query?.id || null;
    if (id) {
      this.id = id;
      this.getDetail(this.id);
    }
  },
  methods: {
    getDetail(id) {
      getMpFeedback(id).then(response => {
        this.obj = response.data;
        if(!this.obj.user) {
          this.obj.user = {};
        }
      });
    },
    handleUpdate() {
      this.reset();
      getMpFeedback(this.id).then(response => {
        this.form = response.data;
        if(!this.form.user) {
          this.form.user = {};
        }
        this.open = true;
        this.title = "回复";
      });
    },
    reset() {
      this.form = {
        id: null,
        title: null,
        description: null,
        img: null,
        userId: null,
        user: {
          realName: null,
          phonenumber: null
        },
        status: null,
        feedbackDate: null,
        result: null,
        resultImg: null,
      };
      this.resetForm("form");
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.status = 'done';
            updateMpFeedback(this.form).then(response => {
              this.$modal.msgSuccess("回复成功");
              this.open = false;
              this.getDetail(this.id);
            });
          }
        }
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    back() {
      /* this.$tab.closeOpenPage({
        path: "/system/mpFeedback",
        query: { "activated": true },
      }); */
      this.$router.go(-1);
    }
  },
};
</script>
<style lang="scss" scoped>
.detail-container {
  padding: 0 24px;
  background: #f9fafc;

  .block {
    padding: 20px 24px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(39, 45, 57, 0.1);
    border-radius: 8px;
    margin-bottom: 24px;
    color: #272d39;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    .info-item {
      display: flex;
      flex-shrink: 0;
      width: 50%;
      box-sizing: border-box;
      padding-right: 10px;
      line-height: 2.2em;

      span {
        display: inline-block;
        width: 130px;
        color: #99a1b4;
        flex-shrink: 0;
      }
    }
  }

  .page-head {
    font-family: "Microsoft YaHei UI Bold";
    font-weight: 700;
    font-size: 24px;
    text-align: left;
    color: #272d39;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
  }
}

.imgList-wrap {
  width: calc(100% - 130px);
  display: inline-block;
}

.flex {
  display: flex;
  justify-content: flex-start;
}
</style>