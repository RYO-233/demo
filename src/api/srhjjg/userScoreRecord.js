import request from '@/utils/request'

// 查询用户积分获取记录列表
export function listUserScoreRecord(query) {
  return request({
    url: '/srhjjg/userScoreRecord/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询用户积分获取记录详细
export function getUserScoreRecord(id) {
  return request({
    url: `/srhjjg/userScoreRecord/${id}`,
    method: 'get'
  })
}

// 新增用户积分获取记录
export function addUserScoreRecord(data) {
  return request({
    url: '/srhjjg/userScoreRecord',
    method: 'post',
    data: data
  })
}

// 修改用户积分获取记录
export function updateUserScoreRecord(data) {
  return request({
    url: '/srhjjg/userScoreRecord',
    method: 'put',
    data: data
  })
}

// 删除用户积分获取记录
export function delUserScoreRecord(id) {
  return request({
    url: `/srhjjg/userScoreRecord/${id}`,
    method: 'delete'
  })
}
