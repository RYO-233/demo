import request from '@/utils/request'

// 查询小程序通知公告列表
export function listMpNotice(query) {
  return request({
    url: '/srhjjg/mpNotice/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询小程序通知公告详细
export function getMpNotice(id) {
  return request({
    url: `/srhjjg/mpNotice/${id}`,
    method: 'get'
  })
}

// 新增小程序通知公告
export function addMpNotice(data) {
  return request({
    url: '/srhjjg/mpNotice',
    method: 'post',
    data: data
  })
}

// 修改小程序通知公告
export function updateMpNotice(data) {
  return request({
    url: '/srhjjg/mpNotice',
    method: 'put',
    data: data
  })
}

// 删除小程序通知公告
export function delMpNotice(id) {
  return request({
    url: `/srhjjg/mpNotice/${id}`,
    method: 'delete'
  })
}
