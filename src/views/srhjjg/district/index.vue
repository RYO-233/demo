<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
  <!--     <el-form-item label="名称" prop="name">
       
      </el-form-item> -->
      <el-form-item>
         <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['srhjjg:district:add']"
        >添加</el-button>
      </el-form-item>
      <el-form-item label="片区属性" prop="prop">
        <el-select v-model="queryParams.prop" placeholder="请选择片区属性" clearable>
          <el-option
            v-for="dict in dict.type.district_prop"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        
      </el-form-item>
      <el-form-item >
         <el-input
          v-model="queryParams.name"
          placeholder="搜索片区名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

   <!--  <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['srhjjg:district:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['srhjjg:district:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['srhjjg:district:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['srhjjg:district:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->
  <bl-table :listData="districtList" :queryParams="queryParams"  :loading="loading" @getList="getList" @handleSelectionChange="handleSelectionChange" >

     <template slot="col">

   
      <el-table-column label="所属片区" align="center" prop="name" />
      <el-table-column label="片区属性" align="center" prop="prop">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.district_prop" :value="scope.row.prop"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="镇街多边形经度,维度" align="center" prop="areaPoints" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
           
            @click="handleUpdate(scope.row)"
            v-hasPermi="['srhjjg:district:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
           
            @click="handleDelete(scope.row)"
            v-hasPermi="['srhjjg:district:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
     </template>
  </bl-table>
    <!-- 添加或修改片区对话框 -->
    <el-dialog :title="title" v-if="open"  :visible.sync="open" width="1200px" :close-on-click-modal=false append-to-body>
      <el-form ref="form" :inline="true" label-position="top"  :model="form" :rules="rules" label-width="110px">
        <el-form-item label="街镇名称" prop="name" class="half">
          <el-input v-model="form.name" placeholder="请输入名称"  />
        </el-form-item>
        <el-form-item label="片区属性" prop="prop" class="half">
          <el-select v-model="form.prop" placeholder="请选择片区属性">
            <el-option
              v-for="dict in dict.type.district_prop"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编辑范围" prop="areaPoints">
          <!-- <el-input v-model="form.areaPoints" type="textarea" placeholder="请输入内容" /> -->
           <draw-map v-if="open" class="maps" :defaultColor="defaultColor" :defaultArea="this.defaultPonits" @getMapPointsData="getMapPointsData"></draw-map>
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
import { listDistrict, getDistrict, delDistrict, addDistrict, updateDistrict } from "@/api/srhjjg/district";
import * as validateForm from "@/utils/validateForm"
import DrawMap from '@/components/Map/drawMap.vue'
import blTable from '@/components/blade/bl-table'
export default {
  name: "District",
  dicts: ['district_prop'],
  components: { DrawMap,blTable},
  data() {
    return {
      defaultPonits:"",
      defaultColor:"",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 片区表格数据
      districtList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        total:0,
        name: null,
        prop: null,
        areaPoints: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        prop: [
          { required: true, message: "片区属性,字典district_prop不能为空", trigger: "change" },
        ],
        areaPoints: [
          { required: true, message: "未编辑范围", trigger: "change" },
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    
    /* 获取编辑范围数据 */
    getMapPointsData(ponits,polygonColor){
      console.log(ponits,polygonColor);
      if(ponits&&ponits.length>0){
        let str="";
        ponits.forEach(item=>{
          
            str=str+item.lng+","+item.lat+";"
          
        })
        this.form.areaPoints=str;//JSON.stringify(ponits);
        console.log("片区范围");
        console.log( this.form.areaPoints);
      }else{
        this.form.areaPoints="";
      }
      if(polygonColor){
        this.form.polygonColor=polygonColor;
      }else{
        this.form.polygonColor=""
      }
      
    
    },
    /** 查询片区列表 */
    getList() {
      this.loading = true;
      listDistrict(this.queryParams).then(response => {
        this.districtList = response.rows || [];
        this.queryParams.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        prop: null,
        areaPoints: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
       this.defaultPonits="";
        this.defaultColor="";
      this.title = "添加片区";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDistrict(id).then(response => {
        this.form = response.data;
        this.defaultPonits=this.form.areaPoints;
        this.defaultColor=this.form.polygonColor;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDistrict(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDistrict(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除？').then(function() {
        return delDistrict(ids);
      }).then((res) => {
        this.getList();
        this.$modal.msgSuccess(res.msg);
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('srhjjg/district/export', {
        ...this.queryParams
      }, `片区_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style lang="scss" scoped>
.maps {
  width: 1150px;
  height: 500px;
  margin: 0 auto;
}
  
.half{
  margin-right:150px;
  width: 400px;
}

</style>