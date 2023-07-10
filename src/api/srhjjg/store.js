import request from '@/utils/request'

// 查询商铺列表
export function listStore(query) {
  return request({
    url: '/srhjjg/store/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询商铺详细
export function getStore(id) {
  return request({
    url: `/srhjjg/store/${id}`,
    method: 'get'
  })
}

// 新增商铺
export function addStore(data) {
  return request({
    url: '/srhjjg/store',
    method: 'post',
    data: data
  })
}

// 修改商铺
export function updateStore(data) {
  return request({
    url: '/srhjjg/store',
    method: 'put',
    data: data
  })
}

// 删除商铺
export function delStore(id) {
  return request({
    url: `/srhjjg/store/${id}`,
    method: 'delete'
  })
}
