import request from '@/utils/request'

// 查询案件列表
export function listSrcase(query) {
  return request({
    url: '/srhjjg/srcase/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null,
      orderByColumn: query.orderByColumn ? query.orderByColumn : null,
      isAsc: query.isAsc ? query.isAsc : null,
    }
  })
}

export function taskList(query) {
  return request({
    url: '/wx/srcase/taskList',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null,
    }
  })
}


// 查询案件详细
export function getSrcase(id) {
  return request({
    url: `/srhjjg/srcase/${id}`,
    method: 'get'
  })
}

// 新增案件
export function addSrcase(data) {
  return request({
    url: '/srhjjg/srcase',
    method: 'post',
    data: data
  })
}

// 修改案件
export function updateSrcase(data) {
  return request({
    url: '/srhjjg/srcase',
    method: 'put',
    data: data
  })
}

// 删除案件
export function delSrcase(id) {
  return request({
    url: `/srhjjg/srcase/${id}`,
    method: 'delete'
  })
}
//立案

export function lianSrcase(data) {
  return request({
    url: '/srhjjg/srcase/lian',
    method: 'post',
    data: data
  })
}
//驳回
export function  bohuiSrcase(data) {
  return request({
    url: '/srhjjg/srcase/bohui',
    method: 'post',
    data: data
  })
}
/* 案件处理 */
//新增案件处理
export function  addHandleSrcase(data) {
  return request({
    url: '/srhjjg/caseHandleDetail',
    method: 'post',
    data: data
  })
}
//修改案件处理
export function updateHandleSrcase(data) {
  return request({
    url: '/srhjjg/caseHandleDetail',
    method: 'put',
    data: data
  })
}
//直接处理
export function  handleDirect(data) {
  return request({
    url: '/srhjjg/caseHandleDetail/handleDirect',
    method: 'post',
    data: data
  })
}
//修改案件转办
export function caseRedirectRecord(data){
  return request({
    url: '/srhjjg/caseRedirectRecord',
    method: 'put',
    data: data
  })
}
//回退
export function huitui(data) {
  return request({
    url: '/srhjjg/srcase/huitui',
    method: 'post',
    data: data
  })
}
//审核展板
export function auditZhuanbanSrcase(data) {
  return request({
    url: '/srhjjg/srcase/zhuanbanAudit',
    method: 'post',
    data: data
  })
}
//处理情况时间线
export function srcaseHeadTimeLine(data){
  return request({
    url: '/srhjjg/srcase/handleTimeLine',
    method: 'get',
    params: data
  })
}
//预计结案时间

export function srcasePredicateTime(data) {
  return request({
    url: '/srhjjg/srcase/predicateTime',
    method: 'post',
    data: data
  })
}
//案件分配修改
export function srcaseDispatchNodeEdit(data) {
  return request({
    url: '/srhjjg/srcase/dispatchNodeEdit',
    method: 'post',
    data: data
  })
}
//
