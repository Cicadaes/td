// 默认 x 轴样式
const CHART_XAXIS = {
  type: 'category',
  boundaryGap: false,
  scale: true,
  nameLocation: 'middle',
  nameGap: 12,
  nameTextStyle: {
    
  },
  splitLine: {
    show: false,
    lineStyle: {
      type: 'dashed',
      color: '#E9EAEC',
    },
  },
  axisTick: {
    show: true,
    alignWithLabel: true,
    lineStyle: {
      color: '#E9EAEC',
    },
  },
  axisLine: {
    lineStyle: {
      color: '#E9EAEC',
    },
    onZero: false,
  },
  axisLabel: {
    color: '#80848F',
    fontFamily: 'HelveticaNeue',
  },
};
export default CHART_XAXIS;
