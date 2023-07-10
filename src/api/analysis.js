import request from "@/utils/request";

// 案件总览
export function getCaseNum(query) {
  return request({
    url: "/srhjjg/chart/case/caseNum",
    method: "post",
    data: query,
  });
}
//案件处置率
export function getCaseRate(query) {
  return request({
    url: "/srhjjg/chart/case/pie",
    method: "post",
    data: query,
  });
}
//部门案件数分析
export function getOrgCaseNum(query) {
  return request({
    url: "/srhjjg/chart/case/orgDoneNumCompare",
    method: "post",
    data: query,
  });
}
//部门结案率
export function getOrgCaseRate(query) {
  return request({
    url: "/srhjjg/chart/case/orgDonePercent",
    method: "post",
    data: query,
  });
}
//问题分析
export function caseAnalysis(query) {
  return request({
    url: "/srhjjg/chart/problem/analyze",
    method: "post",
    data: query,
  });
}
//区域分析-柱状图
export function areaAnalysisBar(query) {
  return request({
    url: "/srhjjg/chart/area/bar",
    method: "post",
    data: query,
  });
}
//区域分析-环形图
export function areaAnalysisPie(query) {
  return request({
    url: "/srhjjg/chart/area/ring",
    method: "post",
    data: query,
  });
}
//区域分析-案件详情
export function areaAnalysisTable(type, timeStart, timeEnd) {
  return request({
    url: "/srhjjg/chart/area/table",
    method: "post",
    //data: query,
    params: {
      org: type,
      timeStart: timeStart,
      timeEnd: timeEnd,
    },
  });
}
//走势分析
export function trendAnalysis(query) {
  return request({
    url: "/srhjjg/chart/trend/bar",
    method: "post",
    data: query,
  });
}
//部门考核分析
export function assessmentAnalysis(query) {
  return request({
    url: "/srhjjg/chart/orgAppraisal/table",
    method: "post",
    data: query,
  });
}
//公众上报分析
export function reportAnalysis(query) {
  return request({
    url: "/srhjjg/chart/userReport/table",
    method: "post",
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null,
    },
  });
}
//志愿者上报分析
export function volunteerAnalysis(query) {
  return request({
    url: "/srhjjg/chart/zy/table",
    method: "post",
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null,
    },
  });
}
//积分总览信息
export function integralSummary(query) {
  return request({
    url: "/srhjjg/chart/userScore/card",
    method: "post",
    data: query,
  });
}
//积分获取记录
export function integralAnalysis(query) {
  return request({
    url: "/srhjjg/chart/userScore/gotRecord",
    method: "post",
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null,
    },
  });
}
//积分兑换记录
export function exchangeAnalysis(query) {
  return request({
    url: "/srhjjg/chart/userScore/exchangeRecord",
    method: "post",
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null,
    },
  });
}
//坐席考核分析
export function seatAssessmentAnalysis(query) {
  return request({
    url: "/srhjjg/chart/zx/table",
    method: "post",
    data: query,
    params: {
      pageNum: query.pageNum ? query.pageNum : null,
      pageSize: query.pageSize ? query.pageSize : null,
    },
  });
}
