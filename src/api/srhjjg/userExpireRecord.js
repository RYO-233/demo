import request from '@/utils/request'

// 查询用户有效期修改记录列表
export function listUserExpireRecord(query) {
  return request({
    url: '/srhjjg/userExpireRecord/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询用户有效期修改记录详细
export function getUserExpireRecord(id) {
  return request({
    url: `/srhjjg/userExpireRecord/${id}`,
    method: 'get'
  })
}

// 新增用户有效期修改记录
export function addUserExpireRecord(data) {
  return request({
    url: '/srhjjg/userExpireRecord/add',
    method: 'post',
    data: data
  })
}

// 修改用户有效期修改记录
export function updateUserExpireRecord(data) {
  return request({
    url: '/srhjjg/userExpireRecord/edit',
    method: 'post',
    data: data
  })
}

// 删除用户有效期修改记录
export function delUserExpireRecord(id) {
  return request({
    url: `/srhjjg/userExpireRecord/delete/${id}`,
    method: 'post'
  })
}
