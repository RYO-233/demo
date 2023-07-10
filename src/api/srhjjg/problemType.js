import request from '@/utils/request'

// 查询问题类别列表
export function listProblemType(query) {
  return request({
    url: '/srhjjg/problemType/list',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null,
      level:query.level,
      id:query.id?query.id:null,
      parentId:query.parentId?query.parentId:null
    }
  })
}

export function treeListProblemType(query) {
  return request({
    url: '/srhjjg/problemType/treeList',
    method: 'post',
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null
    }
  })
}

// 查询问题类别详细
export function getProblemType(id) {
  return request({
    url: `/srhjjg/problemType/${id}`,
    method: 'get'
  })
}

// 新增问题类别
export function addProblemType(data) {
  return request({
    url: '/srhjjg/problemType',
    method: 'post',
    data: data
  })
}

// 修改问题类别
export function updateProblemType(data) {
  return request({
    url: '/srhjjg/problemType',
    method: 'put',
    data: data
  })
}

// 删除问题类别
export function delProblemType(id) {
  return request({
    url: `/srhjjg/problemType/${id}`,
    method: 'delete'
  })
}
