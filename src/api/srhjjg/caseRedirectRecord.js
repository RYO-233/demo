import request from '@/utils/request'

// 查询案件转办记录列表
export function listCaseRedirectRecord(query) {
  return request({
    url: '/srhjjg/caseRedirectRecord/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询案件转办记录详细
export function getCaseRedirectRecord(id) {
  return request({
    url: `/srhjjg/caseRedirectRecord/${id}`,
    method: 'get'
  })
}

// 新增案件转办记录
export function addCaseRedirectRecord(data) {
  return request({
    url: '/srhjjg/caseRedirectRecord',
    method: 'post',
    data: data
  })
}

// 修改案件转办记录
export function updateCaseRedirectRecord(data) {
  return request({
    url: '/srhjjg/caseRedirectRecord',
    method: 'put',
    data: data
  })
}

// 删除案件转办记录
export function delCaseRedirectRecord(id) {
  return request({
    url: `/srhjjg/caseRedirectRecord/${id}`,
    method: 'delete'
  })
}
