export class commonModel {
  xAxis = {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    nameTextStyle: {
      fontFamily: 'Roboto-Regular',
      color: 'rgba(23,35,61,0.55)',
      lineHeight: 20
    },
    axisTick: {
      show: true,
      alignWithLabel: true,
      axisLine: {
        lineStyle: {
          color: '#DDDEE1'
        }
      }
    }
  };
  yAxis = {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      fontFamily: 'HelveticaNeue',
      fontSize: 12,
      color: '#80848F',
      fontWeight: 'normal'
    }
  };
  grid = {
    left: '0%',
    right: '0%',
    bottom: '0%',
    containLabel: true
  };
  legend = {
    icon: 'roundRect',
    type: 'scroll',
    itemWidth: 16,
    right: '0%',
    itemGap: 16,
    textStyle: {
      color: ' rgba(23,35,61,0.75)',
      fontFamily: 'PingFangSC-Regular',
      lineHeight: 20
    },
    formatter: function(name) {
      return name && name.length > 26 ? name.slice(0, 26) + '...' : name;
    }
  };
  tooltip(that: any, tootip: boolean = false) {
    return {
      show: true,
      backgroundColor: 'rgba(23,35,61,0.85)',
      padding: 12,
      formatter: function(params: any) {
        if (tootip) {
          return that.Globals.promptBoxFormatting(params, that.Globals.formatSeconds);
        } else {
          return that.Globals.promptBoxFormatting(params);
        }
      }
    };
  }
}
