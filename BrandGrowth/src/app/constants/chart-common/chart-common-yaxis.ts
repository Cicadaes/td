// 默认Y 轴样式
const CHART_YAXIS = {
  type: 'value',
  splitLine: {
    show: true,
    lineStyle: {
      width: 1,
      color: '#E9EAEC',
      type: 'dashed',
    },
  },
  splitArea: {
    show: false,
  },
  axisLine: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  axisLabel: {
    color: '#80848F',
    fontFamily: 'HelveticaNeue',
    formatter(value: any) {
      let number = value;
      if (number >= 1000) {
        number = `${(number / 1000).toFixed(1)} k`;
      }
      return number;
    }
  },
};
export default CHART_YAXIS;
