import request from '@/utils/request'

// 查询用户积分获取记录列表
export function userExpireRecord(query) {
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
  export function userExpireRecordAdd(query) {
    return request({
      url: '/srhjjg/userExpireRecord/add',
      method: 'post',
      data: query,
    })
  }
  export function userExpireRecordBatchAdd(query) {
    return request({
      url: '/srhjjg/userExpireRecord/batchAdd',
      method: 'post',
      data: query,
    })
  }
