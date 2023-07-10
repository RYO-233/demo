import request from '@/utils/request'

// 查询小程序通知公告推送用户列表
export function listMpNoticePushUser(query) {
  return request({
    url: '/srhjjg/mpNoticePushUser/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询小程序通知公告推送用户详细
export function getMpNoticePushUser(id) {
  return request({
    url: `/srhjjg/mpNoticePushUser/${id}`,
    method: 'get'
  })
}

// 新增小程序通知公告推送用户
export function addMpNoticePushUser(data) {
  return request({
    url: '/srhjjg/mpNoticePushUser',
    method: 'post',
    data: data
  })
}

// 修改小程序通知公告推送用户
export function updateMpNoticePushUser(data) {
  return request({
    url: '/srhjjg/mpNoticePushUser',
    method: 'put',
    data: data
  })
}

// 删除小程序通知公告推送用户
export function delMpNoticePushUser(id) {
  return request({
    url: `/srhjjg/mpNoticePushUser/${id}`,
    method: 'delete'
  })
}
export function  addAndSentNotice(data){
  return request({
    url: '/srhjjg/mpNotice/addAndSend',
    method: 'post',
    data: data
  })
}