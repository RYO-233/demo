
import request from '@/utils/request'
//街道结案率
export function districtEndPercent(params) {
    return request({
      url: '/srhjjg/chart/screen/districtEndPercent',
      method: 'post',
      params:params
    })
  }
//本周案件情况
export function thisWeekCaseNum() {
    return request({
      url: '/srhjjg/chart/screen/thisWeekCaseNum',
      method: 'post',
    }) 
  }
//待派发案件
export function todoCaseList() {
    return request({
      url: '/srhjjg/chart/screen/todoCaseList',
      method: 'post',
     
    })
  }
//
