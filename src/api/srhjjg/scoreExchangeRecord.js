import request from '@/utils/request'

// 查询用户积分兑换记录列表
export function listScoreExchangeRecord(query) {
  return request({
    url: '/srhjjg/scoreExchangeRecord/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询用户积分兑换记录详细
export function getScoreExchangeRecord(id) {
  return request({
    url: `/srhjjg/scoreExchangeRecord/${id}`,
    method: 'get'
  })
}

// 新增用户积分兑换记录
export function addScoreExchangeRecord(data) {
  return request({
    url: '/srhjjg/scoreExchangeRecord',
    method: 'post',
    data: data
  })
}

// 修改用户积分兑换记录
export function updateScoreExchangeRecord(data) {
  return request({
    url: '/srhjjg/scoreExchangeRecord',
    method: 'put',
    data: data
  })
}

// 删除用户积分兑换记录
export function delScoreExchangeRecord(id) {
  return request({
    url: `/srhjjg/scoreExchangeRecord/${id}`,
    method: 'delete'
  })
}
