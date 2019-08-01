// 默认 tooltip
const TOOLTIP = {
  show: true,
  trigger: 'axis',
  borderColor: '#DDDEE1',
  borderWidth: 1,
  backgroundColor: 'rgba(255,255,255,0.95)',
  textStyle: {
    color: '#868da0',
    fontSize: 14,
  },
  padding: [16, 18],
  extraCssText: 'border-radius: 2px;',
  axisPointer: {
    lineStyle: {
      color: '#E9EAEC',
      width: 1,
    },
  },
  enterable: false,
  hideDelay: 0,
  confine: false,
  formatter(params: any) {
    if (!params) {
      return '';
    }
    let str = `<div style="width: 225px;"><p>${params[0].name}</p>`;
    const unitArray = ['异常曝光率', '异常点击率', '转化率'];
    
    params.map((x: any) => {
      const unit = unitArray.indexOf(x.seriesName) === -1 || x.value === 'N/A' ? '' : '%';
      str += `<p>
        <span style="
          width: 12px; 
          height: 12px; 
          display: inline-block; 
          border-radius: 100%;
          background: ${x.color}; 
          marsin-right: 10px;"></span>
        <span>${x.seriesName}</span>
        <span style="color: ${x.color}; float: right;">${x.value}${unit}</span>
      </p>`;
    });

    str += '</div>';
    return str;
  }
};
export default TOOLTIP;
