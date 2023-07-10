import request from '@/utils/request'

// 查询监控点列表
export function listMonitorPoint(query) {
  return request({
    url: '/srhjjg/monitorPoint/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询监控点详细
export function getMonitorPoint(id) {
  return request({
    url: `/srhjjg/monitorPoint/${id}`,
    method: 'get'
  })
}

// 新增监控点
export function addMonitorPoint(data) {
  return request({
    url: '/srhjjg/monitorPoint',
    method: 'post',
    data: data
  })
}

// 修改监控点
export function updateMonitorPoint(data) {
  return request({
    url: '/srhjjg/monitorPoint',
    method: 'put',
    data: data
  })
}

// 删除监控点
export function delMonitorPoint(id) {
  return request({
    url: `/srhjjg/monitorPoint/${id}`,
    method: 'delete'
  })
}
