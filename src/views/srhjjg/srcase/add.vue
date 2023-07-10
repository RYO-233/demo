<template>
  <div class="edit-container">
    <div class="page-head">
      添加台账
      <div>
        <el-button size="small" type="primary" @click="submitForm"
          class="back">提 交</el-button
        >
        <el-button size="small" type="primary" class="back" plain @click="cancel">返 回</el-button>
      </div>
    </div>
   <blScrollContent >
    <el-form
      class="addform"
      ref="form"
      :inline="true"
      label-position="top"
      :model="form"
      :rules="rules"
      label-width="120px"
      @submit.native.prevent
    >
      <div class="block">
       <!--  <el-form-item label="案件编号" required>
          <el-input v-model="form.caseNum" placeholder="案件编号"></el-input>
        </el-form-item>
        <el-form-item></el-form-item> -->
        <el-form-item label="上报人" prop="fbPerson">
          <el-input v-model.trim="form.fbPerson" placeholder="请输入上报人" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="fbPhone">
          <el-input v-model.trim="form.fbPhone"  maxlength="20" oninput="value=value.replace(/[^\d]/g,'');if(value.length > 11)value = value.slice(0, 11)" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="问题描述" prop="caseDetail">
          <el-input
            v-model.trim="form.caseDetail"
            type="textarea"
            placeholder="请输入问题描述"
            maxlength="300"
            show-word-limit
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="问题图片" prop="caseImages">
          <image-upload class="myupload" v-model="form.caseImages" />
        </el-form-item>
      </div>
      <div class="block">
        <el-form-item label="问题类别(大类)" prop="problemRootId" >
          <el-select
            filterable
            clearable
            v-model="form.problemRootId"
            placeholder="请选择问题类别(大类)"
            @change="handleChangeproblemRoot"
          >
            <el-option
              v-for="dict in problemTypeOptions1"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            ></el-option>
          </el-select>
          <!--  <treeselect v-model="form.problemParentId" 
            :normalizer="normalizer"
            :options="problemTypeOptions1" 
            :show-count="true" 
            :disable-branch-nodes="true"
            placeholder="请选择问题类别(大类)" /> -->
        </el-form-item>
        <el-form-item label="问题类别(小类)" prop="problemParentId" >
          <el-select
           filterable
           clearable
            v-model="form.problemParentId"
            placeholder="请选择问题类别(小类)"
            @change="handleChangeProblemParent"
          >
            <el-option
              v-for="dict in problemTypeOptions2"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            ></el-option>
          </el-select>
          <!--  <treeselect v-model="form.problemId" 
            :normalizer="normalizer"
            :options="problemTypeOptions2" 
            :show-count="true" 
            :disable-branch-nodes="true"
            placeholder="请选择问题类别(小类)" /> -->
        </el-form-item>
        <el-form-item label="是否督办案件" prop="isPoint" >
          <el-select v-model="form.isPoint" placeholder="请选择是否督办案件">
            <el-option
              v-for="dict in dict.type.yyt_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联商铺" prop="storeId">
          <StoreListSel
            class="myinput"
            :inputVal="form.store.storeName"
            @confirmCB="storeConfirm"
            @clearCB="storeCancle"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注"
            maxlength="300"
            show-word-limit
             :rows="4"
          />
        </el-form-item>
      </div>
      <div class="block">
        <el-form-item label="所在片区" prop="districtId" required>
          <el-select
            @change="handleChangeDistrict"
            v-model="form.districtId"
            placeholder="请选择所在片区"
            ><!-- dict.type.district -->
            <el-option
              v-for="dict in districtList"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" "></el-form-item>
        <el-form-item label="监控位置" prop="monitorId">
          <MonitorPointListSel
            class="myinput"
            :inputVal="form.monitorPoint.name"
            @confirmCB="monitorFormConfirm"
            @clearCB="monitorFormCancle"
          />
        </el-form-item>
       <!--  <el-form-item label=" "></el-form-item> -->
           <!--  @blur="handleChangeAddress" -->
       <!--  <el-form-item label="问题地址" prop="address">
        
          <el-input
            maxlength="20"
            v-model="form.address"
            placeholder="请输入问题地址"
          
          ></el-input>
     
        </el-form-item> -->
             <!--  <el-autocomplete
           class="myinput"
          v-model="form.address"
          :fetch-suggestions="queryAddressSearch"
          placeholder="请输入问题地址"
          @select="handleAddressSelect"
          :maxlength="20"
          clearable
        ></el-autocomplete> -->
        <el-form-item label=" "></el-form-item>
       
        <el-form-item label=" " class="fullitem">
          <drawMap
            class="mymap-wrap"
            :pcenter="center"
            :markers="markersStr"
            :path="path"
            :strokeColor="strokeColor"
           
            @updateMarkerLocal="updateMarkerLocal"
          ></drawMap>
        </el-form-item>
      </div>
    </el-form>
   </blScrollContent>
    <UserListSelTable
      ref="userListSelTable"
      :multiSel="true"
      @confirmCB="userSelConfirmCB"
    />
  </div>
</template>

<script>
import StoreListSel from "@/views/components/store/StoreListSel";
import MonitorPointListSel from "@/views/components/monitorPoint/MonitorPointListSel";
import { pickerOptions } from "@/utils/constant";
import { treeListProblemType, listProblemType } from "@/api/srhjjg/problemType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listDept } from "@/api/system/dept";
import { listMonitorPoint } from "@/api/srhjjg/monitorPoint";

import { getSrcase, addSrcase, updateSrcase } from "@/api/srhjjg/srcase";
import { listDistrict } from "@/api/srhjjg/district";
import UserListSelTable from "@/views/components/user/UserListSelTable";
import drawMap from "@/components/Map/markMap";
import blScrollContent from "@/components/blade/bl-scroll-content";
export default {
  props: [],
  dicts: ["case_status", "yyt_yes_no", "district", "case_type"],
  components: {
    drawMap,
    StoreListSel,
    MonitorPointListSel,
    pickerOptions,
    Treeselect,
    UserListSelTable,
    blScrollContent
  },
  data() {
    return {
      canAddMarker:true,
      searchKeyword:null,
      path:null,
      strokeColor:"",
      markers: [{},{},{}],
      markersStr:"",
      center: { lng: 114.97731018066408, lat: 25.8246784210205 },
      districtList: [],
      problemTypeList: [],
      nodetail: true,
      problemTypeOptions1: [],
      problemTypeOptions2: [],
      orgOptions: [],
      monitorOptions: [],
      form: {
        caseType:'task',
        handleUserIds: null,
        handleUserNames: null,
        problemRoot: null,
        problemRootId:null,
        problemParentId: null,
        isPoint: null,
        address:"",
        latitude:"",
        longitude:"",
        store: {
          name: null,
        },
        monitorId: null,
        monitorPoint: {
          name: null,
        },
      },
      // 表单校验
      rules: {
        fbPerson:[{ required: true, message: "上报人不能为空", trigger: "blur" },],
        fbPhone:[{ required: true, message: "联系方式不能为空", trigger: "blur" },
          {min:11,max:11, message: "联系方式格式错误",trigger: "blur"},
         ],
        caseDetail:[
          { required: true, message: "问题描述不能为空", trigger: "change" },
        ],
        caseImages:[
          { required: true, message: "问题图片不能为空", trigger: "change" },
        ],
        isPoint: [
          { required: true, message: "督办案件不能为空", trigger: "change" },
        ],
        fbTime: [
          { required: true, message: "发现时间不能为空", trigger: "blur" },
        ],
        problemRootId: [
          { required: true, message: "问题大类不能为空", trigger: "change" },
        ],
        problemParentId: [
          { required: true, message: "问题小类不能为空", trigger: "change" },
        ],
        districtId: [
          { required: true, message: "所在片区不能为空", trigger: "blur" },
        ],
        organizationId: [
          { required: true, message: "责任单位不能为空", trigger: "blur" },
        ],
        monitorId: [
          { required: true, message: "监控位置不能为空", trigger: "change" },
        ],
        address:[  { required: true, message: "问题地址不能为空", trigger: "change" }],
        remark: [{ max: 300, message: "长度不得超过300", trigger: "blur" }],
      },
    };
  },
  computed:{
   
  },
  beforeCreate() {
    const dom = document.querySelector('.el-tooltip__popper')
    if (dom) {
        dom.remove()
    }
},
  created() {
     const token = this.$route.query?.token || null;
    if(token){
     this.form.caseImages= this.$route.query?.picUrl||null
     if(this.$route.query.monitor){
      const monitorPointName =this.$route.query.monitor.replaceAll("\"", "").replaceAll("\'", "") ;
        listMonitorPoint({
          params:{
            nameEq:monitorPointName
          }
        }).then(res => {
          if(res.rows&&res.rows.length>0){
            this.form.monitorPoint.name=monitorPointName
             this.form.monitorId=res.rows[0].id;
          }else{
            this.$message.warning("当前监控位置不在监控列表数据中，请重新选择监控位置！");
          }
        })
     }
    
      console.log(this.form); 
    }
  },
  mounted() {
    this.getProblemselect();
    /* this.getProblemTreeselect(); */
    this.getOrgTreeSelect();
    this.getMonitorOptions();
    this.getDistrictList();
  },
  methods: {
    getMarkersStr(){
      let newArr=[];
      this.markers.forEach(item=>{
        if(Object.keys(item).length != 0){
          console.log(item);
          newArr.push(item);
        }
      })
     this.markersStr=JSON.stringify(newArr)
    },
    addProblemAddressMark(point,updateCenter=true){
      const address = {
          ...point,
          dragging:true,
          icon: require("@/assets/images/problemAddress.png"),
          };
      this.markers[1] = address;
      if(updateCenter){
         this.center = point;
      }
      this.getMarkersStr();
    },
    //问题地址
     updateMarkerLocal(point,rs){
      this.addProblemAddressMark(point,false);
      this.form.latitude=point.lat;
      this.form.longitude=point.lng;
    },     //问题地址
    queryAddressSearch(queryString,cb){
       var restaurants =[] ;
       console.log(this.restaurants);
        if(this.restaurants){
           restaurants.push({
            value:this.restaurants.address,
            point:this.restaurants.point
          })
          this.restaurants.surroundingPois.forEach(item=>{
            restaurants.push({
              value:item.address+"-"+item.title,
              point:item.point
            })
          })
        }
        console.log(restaurants);
        /* let  results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants; */
        // 调用 callback 返回建议列表的数据
        cb(restaurants);
    },
    handleAddressSelect(e){
       this.form.address=e.value;
       this.form.latitude=e.point.lat;
       this.form.longitude=e.point.lng;

    },
    handleChangeAddress(){
   this.searchKeyword=this.form.address;
    },
    //根据问题地址搜索坐标点
    searchcomplete(e){
       if(e&&e.Yr&&e.Yr.length>0){
        const point=e.Yr[0].point;
        this.addProblemAddressMark(point);
       }
       
    },
    /** 查询片区列表 */
    getDistrictList() {
      const queryParams = {
        pageNum: 1,
        pageSize: 100,
      };
      listDistrict(queryParams).then((res) => {
        this.districtList = res.rows || [];
      });
    },
    handleChangestartCaseCondition(val) {
      //立案条件切换
    },
    //问题大类切换
    handleChangeproblemRoot(id) {
      this.form.problemParentId = null;
      if (id) {
        this.getProblemselect(1, id);
      } else {
        this.problemTypeOptions2 = [];
      }
       this.problemTypeList = []
    },
    //问题小类切换
    handleChangeProblemParent(id) {
      this.problemTypeListFun();
    },
    /** 查询问题类别列表立案条件信息 */
    async problemTypeListFun() {
       if(this.form.problemParentId){
         let res = await listProblemType({
            pageNum: 1,
            pageSize: 100,
            parentId: this.form.problemParentId,
          });
          this.problemTypeList = res.dada || [];
       }else{
        this.problemTypeList=[]
       }
     
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },

    orgNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
      };
    },
    async getProblemselect(level = 0, id = null) {
      if (level == 0) {
        let res = await listProblemType({
          level: level,
          pageNum: 1,
          pageSize: 100,
          id: id,
        });
        this.problemTypeOptions1 = res.data || [];
      } else {
        let res = await listProblemType({
          pageNum: 1,
          pageSize: 100,
          parentId: id,
        });
        this.problemTypeOptions2 = res.data || [];
      }
    },
    getProblemTreeselect() {
      treeListProblemType({ pageSize: 0 }).then((response) => {
        const optionsData = this.handleTree(response.data);
        optionsData.forEach((item) => {
          if (!item.children) {
            item.isDisabled = true;
          }
        });
        this.problemTypeOptions2 = optionsData;
      });
    },
    showUserSel(e) {
      if (e.target.tagName === "I") {
        this.form.handleUserIds = null;
        this.form.handleUserNames = null;
      } else {
        this.$refs.userListSelTable.show();
      }
    },
    userSelConfirmCB(data) {
      this.form.handleUserIds = data.map((item) => item.userId);
      this.form.handleUserNames = data.map((item) => item.realName).join(",");
    },
    getOrgTreeSelect() {
      listDept({ pageSize: 0 }).then((response) => {
        this.orgOptions = this.handleTree(response.data, "deptId");
      });
    },
    getMonitorOptions() {
      listMonitorPoint({ pageSize: 0 }).then((response) => {
        this.monitorOptions = response.rows;
      });
    },
    //片区切换
    handleChangeDistrict(e) {
      let ind = this.districtList.findIndex((item) => {
        return item.id == e;
      });
      console.log(this.districtList[ind]);
      if (ind != -1) {
       /*  let areaPoints=JSON.parse(this.districtList[ind].areaPoints)||[];
        let PointsArr=[];
        if(areaPoints&&areaPoints.length>0){
          areaPoints.forEach(item=>{
            PointsArr.push(item.latLng);
          })
        } */
        this.path= this.districtList[ind].areaPoints;
        this.strokeColor=this.districtList[ind].polygonColor;
     
      }
    },
    //关联商铺
    storeConfirm(data) {
      if (data) {
          this.form.storeId = data.id;
          this.form.store = data || {};
          this.form.store.storeName = data.storeName;
          let address = {
            lng: data.longitude,
            lat: data.latitude,
            icon: require("@/assets/images/addShop.png"),
          };
          console.log("商铺坐标",data.longitude, data.latitude);
          this.center = address;
          this.markers[0] = address;
          this.getMarkersStr();
        
       /*  this.$forceUpdate(); */
      }
    },
    storeCancle() {
      this.form.storeId = null;
      this.form.store.storeName = null;
    },
    //监控位置
    monitorFormConfirm(data) {
      if (data) {
        this.form.monitorId = data.id;
        this.form.monitorPoint.name = data.name;
        const address= {
          lng: data.longitude,
          lat: data.latitude,
          icon: require("@/assets/images/addMinor.png"),
        };
        this.markers[2] =address
        this.center = address;
          this.getMarkersStr();
      }
    },
    monitorFormCancle() {
      this.form.monitorId = null;
      this.form.monitorPoint.name = null;
    },
    // 取消按钮
    cancel() {
      this.$router.go(-1);
        /*  this.$router.push({path:'/srcase'}); */
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        isPoint: 0,
        fbTime: null,
        problemParentId: null,
        districtId: null,
        organizationId: null,
        monitorId: null,
        caseImages: null,
        storeId: null,
        remark: null,
        caseType: "task",
        store: {
          storeName: null,
        },
        monitorPoint: {
          name: null,
        },
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        
        
        if (valid) {
          if(this.form.monitorPoint && this.form.monitorPoint.name) {
            this.form.address = this.form.monitorPoint.name;
          }
        /*   if(!this.form.latitude||!this.form.longitude){
          
          this.$message.warning("请在地图上标注问题地址经纬度");
        }else{ */
           if (this.form.id != null) {
            updateSrcase(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
               this.$router.go(-1);
             /*  this.$router.push({path:'/srcase',query:{fresh:true}}); */
              /* this.open = false; */
              /*  this.getList(); */
              
            });
          } else {
            addSrcase(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              /*  this.open = false; */
              /*  this.getList(); */
               this.$router.go(-1);
              /* this.$router.push({path:'/srcase',query:{fresh:true}}); */
              
            });
          }
       /*  } */
         
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.edit-container {
  padding: 0 24px;
  background: #f9fafc;
  padding-top: 1px;
  .block {
    padding: 20px 24px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(39, 45, 57, 0.1);
    border-radius: 8px;
    margin-bottom: 24px;
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
 .el-button{
      padding: 7px 20px;
      font-size: 14px;
     }
     .iconfont{
      font-size: 14px;
     }
     .back{
      padding: 7px 25px;
     }
}
.el-form-item {
  width: 50%;
  margin-right: 0;
}
.fullitem{
  width: 100%;
}
.el-input,
.el-select,
.el-textarea,
.vue-treeselect,
.myinput {
  width: 400px !important;
}

</style>