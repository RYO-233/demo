<template>
  <div class="">
   
      <bl-table :listData="listData" :queryParams="queryParams" :loading="loading" @getList="getList">
          <template slot="col">
             <el-table-column label="有效期至" align="left"  prop="expireTime">
               <template slot-scope="scope">
                {{ scope.row.expireTime ? scope.row.expireTime : '长期有效' }}
               </template>
             </el-table-column>
             <el-table-column label="操作人" align="left" prop="operUser.realName"/>
             <el-table-column label="操作时间" align="left" prop="operTime"/>
          </template>
      </bl-table>
  </div>
</template>

<script>
import blTable from '@/components/blade/bl-table';
import {userExpireRecord} from "@/api/srhjjg/validDateUser"
export default {
  props: [],
  components: {blTable},
  data() {
   return {
    loading:false,
    queryParams:{
        id:null,
        pageNum:1,
        pageSize:10,
        total:0
    },
    listData:[]
   }
  },
  created() {
    this.queryParams.userId=this.$route.query.id||null;
    this.getList();
  },
  mounted() {},
  methods: {
    getList(){
        userExpireRecord(this.queryParams).then(res=>{
             this.listData=res.rows||[];
             this.queryParams.total = res.total;
        })
    },

  },
}
</script>
<style lang="scss" scoped>
</style>