import request from '@/utils/request'

// 查询片区列表
export function listDistrict(query) {
  return request({
    url: '/srhjjg/district/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询片区详细
export function getDistrict(id) {
  return request({
    url: `/srhjjg/district/${id}`,
    method: 'get'
  })
}

// 新增片区
export function addDistrict(data) {
  return request({
    url: '/srhjjg/district',
    method: 'post',
    data: data
  })
}

// 修改片区
export function updateDistrict(data) {
  return request({
    url: '/srhjjg/district',
    method: 'put',
    data: data
  })
}

// 删除片区
export function delDistrict(id) {
  return request({
    url: `/srhjjg/district/${id}`,
    method: 'delete'
  })
}
