<template>
  <div class="">
    <div
      class="form-item-wrap"
      v-for="(item, Index) in searchItemList"
      :key="Index"
    >
      <el-form-item
        v-if="item.type != 'upload'"
        :field="item.value"
        :label="item.label"
        :label-col-flex="labelWidth"
        :rules="getFormRules(item)"
      >
        <template v-if="type != 'detail'">
          <!--  下拉选择 -->
          <el-select
            v-if="item.type == 'select'"
            v-model="form[item.value]"
            placeholder="请选择"
          >
            <el-option
              v-for="option in item.options"
              :label="option.label"
              :value="option.code"
              :key="option.code"
            ></el-option>
          </el-select>
         <!--  级联选择器 -->
          <el-cascader
            v-if="item.type=='cascader'"
            v-model="form[item.value]"
            :separator="' '"
            :options="item.options"
            :props="item.props"
            @change="handleChange($event,item)">
          </el-cascader>
          <!--  输入框 -->
          <template v-if="item.type == 'input'">
            <el-input
              type="text"
              maxlength="20"
              v-model="form[item.value]"
              :placeholder="item.placeholder?item.placeholder:'请输入'"
            />
            <span class="normal" v-if="item.units">&nbsp;{{ item.units }}</span>
          </template>

          <!--  数字输入框 -->
          <template v-if="item.type == 'numberInput'">
            <el-input
              type="number"
             maxlength="20"
              v-model="form[item.value]"
              placeholder="请输入"
              :min="item.min"
              :max="item.max"
            />
            <span class="normal" v-if="item.units">&nbsp;{{ item.units }}</span>
          </template>
          <!-- 多行输入框 -->
          <el-textarea
            v-if="item.type == 'textArea'"
            class="textarea"
            maxlength="300"
            placeholder="请输入"
            v-model="form[item.value]"
            max-length="200"
          />
          <!-- 单选框 -->

          <el-radio-group
            v-model="form[item.value]"
            v-if="item.type == 'radio'"
          >
            <el-radio v-for="(option,indexChild) in item.options" :label="option.value" :key="indexChild">{{option.label}}</el-radio>
            
          </el-radio-group>

          <!-- 日期选择 -->
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd "
            v-if="item.type == 'datePicker'"
            v-model="form[item.value]"
          ></el-date-picker>
          <!--  日期范围 -->
          <!-- :value-format="item.valueFormat?item.valueFormat:'YYYY-MM-DD'" -->
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            v-if="item.type == 'rangePicker'"
            @change="getDateFormate(item)"
            v-model="form[item.value]"
          ></el-date-picker>
          <!-- 月份选择 -->
          <el-date-picker
            type="month"
            style="width: 100%"
            v-if="item.type == 'monthPicker'"
            v-model="form[item.value]"
          ></el-date-picker>
          <!--   月份范围 -->
          <el-date-picker
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            v-if="item.type == 'monthRangePicker'"
            v-model="form[item.value]"
          />
          <!-- 输入范围 -->
          <template v-if="item.type == 'inputRange'">
            <el-input
              type="text"
              maxlength="20"
              v-model="form[item.value[0]]"
              placeholder="请输入"
            />
            <span class="normal">&nbsp;至&nbsp;</span>
            <el-input
              type="text"
              maxlength="20"
              v-model="form[item.value[1]]"
              placeholder="请输入"
            />
            <span class="normal" v-if="item.units">&nbsp;{{ item.units }}</span>
          </template>
          <!--  输入数字范围 -->
          <template v-if="item.type == 'numberInputRange'">
            <!-- :formatter="formatter" :parser="parser" -->
            <el-input
              type="number"
              max-length="13"
              v-model="form[item.value[0]]"
              placeholder="请输入"
              :min="item.min"
              :max="item.max"
            />
            <span class="normal">&nbsp;至&nbsp;</span>
            <el-input-number
              max-length="13"
              v-model="form[item.value[1]]"
              placeholder="请输入"
              :min="form[item.value[0]]"
              :max="item.max"
            />
            <span class="normal" v-if="item.units">&nbsp;{{ item.units }}</span>
          </template>
        </template>
        <slot name="detail" :data="item" />
      </el-form-item>
      <!--   <template v-if="item.type == 'upload'">
              <fileUploader
                ref="myfileUploader"
                @onsuccess="uploadOnsuccess"
                :type="type"
                :showUploadBtn="type == 'detail' ? false : true"
                :fileList="file.fileList"
              >
                <template #button>
                  <el-button type="primary">
                    <template #icon>
                      <icon-upload />
                    </template>
                    <template #default>{{
                      $t("common.uploadAttach")
                    }}</template>
                  </el-button>
                </template>
              </fileUploader>
            </template> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    labelWidth: {
      type: String,
      default: "130px",
    },
    type: {
      type: String,
      default: "search",
    },
    searchItemList: Array,
    form: Object,
    colNum: {
      type: Number,
      default: 2,
    },
    justify: String,
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    handleChange(value,item){
      if(value&&value.length>0){
         this.form[item.value] = value[value.length - 1];
      }else{
        this.form[item.value]=""
      }
      
    },
    //日期范围格式处理
    getDateFormate(item) {
      let saveForm = this.form;
      const formateValue = item.formateValue;
      const val = item.value;
      if (saveForm[val]) {
        saveForm[formateValue[0]] = saveForm[val][0]+" "+"00:00:00";
        saveForm[formateValue[1]] = saveForm[val][1]+" "+"23:59:59";
      } else {
        saveForm[formateValue[0]] = "";
        saveForm[formateValue[1]] = "";
      }
      this.saveForm = saveForm;
     /*  this.$listeners.updateform(saveForm); */
    },

    getFormRules(item) {
      const rule = item.rule,
        label = item.label,
        type = item.type;
      let typeMessage = "";
      if (
         type == "cascader"||type == "select" ||
        type === "radio" ||
        type == "datePicker" ||
        type == "rangPicker"
      ) {
        typeMessage = "请选择" + label;
      }
      if (rule && rule.required) {
        let ruleArr = [{ required: true, message: message, trigger: "blur" }];
        return ruleArr;
      } else {
        return [];
      }
    },
  },
};
</script>
<style lang="less" scoped>
.form-item-wrap {
  display: inline-block;
}
input {
  background: #f1f3f5;
}
:deep.el-form-item {
  margin: 0;
  margin-left: 10px;
}
:deep .el-form-item__label {
  color: #414549;
  font-weight: 500;
}

</style>