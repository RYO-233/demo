import request from '@/utils/request'

// 查询小程序用户反馈列表
export function listMpFeedback(query) {
  return request({
    url: '/srhjjg/mpFeedback/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询小程序用户反馈详细
export function getMpFeedback(id) {
  return request({
    url: `/srhjjg/mpFeedback/${id}`,
    method: 'get'
  })
}

// 新增小程序用户反馈
export function addMpFeedback(data) {
  return request({
    url: '/srhjjg/mpFeedback',
    method: 'post',
    data: data
  })
}

// 修改小程序用户反馈
export function updateMpFeedback(data) {
  return request({
    url: '/srhjjg/mpFeedback',
    method: 'put',
    data: data
  })
}

// 删除小程序用户反馈
export function delMpFeedback(id) {
  return request({
    url: `/srhjjg/mpFeedback/${id}`,
    method: 'delete'
  })
}
