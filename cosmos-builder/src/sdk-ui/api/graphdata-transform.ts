const DIMENSION_FIRST: string = 'X'
const DIMENSION_SECOND: string = 'Legend'
const GRAPH_ITEM_VALUE: string = 'Y'


// const DIMENSION_FIRST: string = 'create_dt'
// const DIMENSION_SECOND: string = 'name'
// const GRAPH_ITEM_VALUE: string = 'value3'


/**
 * 根据后端数据拼装成echarts图表数据格式
 * @param  {any}    (item [后端数据]
 * @return {[type]}       [echarts格式数据]
 */

export const getGraphData = (gpdata: any, gptype: string = 'bar') => {

  // 确定数据类型
  // 1 ===》 两维度一指标
  // 0 ===》 一维度一指标
  const DATA_TYPE: number = gpdata[0].hasOwnProperty(DIMENSION_SECOND) ? 1 : 0

  // 根据维度初始化echarts图表数据基本结构
  let op: any = {
    xAxis: [{
      data: []
    }],
    yAxis: [{
      type: 'value'
    }],
    series: []
  }
  if (!DATA_TYPE) {
    op.series.push({
      data: [],
      type: gptype
    })
  }

  // 暂存第二维度
  let dimension_second_arr: any = []

  gpdata.forEach((item: any) => {
    // 添加第一维度
    if (!op.xAxis[0].data.includes(item[DIMENSION_FIRST])) {
      op.xAxis[0].data.push(item[DIMENSION_FIRST])
    }
    if (DATA_TYPE) {
      // 添加series（第二维度）
      if (!dimension_second_arr.includes(item[DIMENSION_SECOND])) {
        dimension_second_arr.push(item[DIMENSION_SECOND])
        op.series.push({
          name: item[DIMENSION_SECOND],
          type: gptype,
          data: [item[GRAPH_ITEM_VALUE]]
        })
      } else {
        op.series[dimension_second_arr.indexOf(item[DIMENSION_SECOND])].data.push(item[GRAPH_ITEM_VALUE])
      }
    } else {
      op.series[0].data.push(item[GRAPH_ITEM_VALUE])
    }
  })
  return op
}
