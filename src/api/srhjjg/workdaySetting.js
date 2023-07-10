import request from '@/utils/request'
//修改每日时间设置
export function editTimeSet(data) {
  return request({
    url: '/srhjjg/timeSet/edit',
    method: 'post',
    data: data
  })
}
//查询每日时间设置
export function queryTimeSet(data) {
  return request({
    url: '/srhjjg/timeSet/list',
    method: 'post',
    data: data
  })
}
//新增节假日设置
export function addHoliday(data) {
  return request({
    url: '/srhjjg/holidays/addOrEdit',
    method: 'post',
    data: data
  })
}

//查询节假日设置列表
export function holidays(query) {
    return request({
      url: '/srhjjg/holidays/list',
      method: 'post',
      data: query,
      params:{
        pageNum:query.pageNum?query.pageNum:null,
        pageSize:query.pageSize?query.pageSize:null
      }
    })
  }
  //获取节假日设置详情
  export function holidaysDetail(id) {
    return request({
      url: `/srhjjg/holidays/detail/${id}`,
      method: 'get',
    })
  }