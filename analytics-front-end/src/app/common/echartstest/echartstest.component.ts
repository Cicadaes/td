import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'echarts-test',
  templateUrl: './echartstest.component.html',
  styleUrls: ['./echartstest.component.less']
})
export class EchartsTestComponent implements OnInit {
  option: any; //图表数据渲染
  functions: Function;
  constructor() {}
  ngOnInit() {
    this.start();
  }
  functionsValue(value: any) {
    return `${value}`;
  }
  functionsPercent(value: any) {
    return `${value}%`;
  }
  functionsSeconds(value) {
    let theTime = parseInt(value); // 秒
    let middle = 0; // 分
    let hour = 0; // 小时
    if (value == 0) {
      return '00:00:00';
    } else if (theTime > 60) {
      middle = parseInt((theTime / 60).toString());
      theTime = parseInt((theTime % 60).toString());
      if (middle > 60) {
        hour = parseInt((middle / 60).toString());
        middle = parseInt((middle % 60).toString());
      }
    } else {
      if (value >= 10) {
        return '00:00:' + theTime;
      } else {
        return '00:00:0' + theTime;
      }
    }
    let result =
      '' + parseInt(theTime.toString()) && parseInt(theTime.toString()) >= 10
        ? parseInt(theTime.toString())
        : '0' + parseInt(theTime.toString());
    if (middle > 0) {
      result = `${
        parseInt(middle.toString()) && parseInt(middle.toString()) >= 10
          ? parseInt(middle.toString())
          : '0' + parseInt(middle.toString())
      }:${result}`;
    } else if (middle == 0) {
      result = '00:' + result;
    }
    if (hour > 0) {
      result = `${
        parseInt(hour.toString()) && parseInt(hour.toString()) >= 10
          ? parseInt(hour.toString())
          : '0' + parseInt(hour.toString())
      }:${result}`;
    } else if (hour == 0) {
      result = '00:' + result;
    }
    return result;
  }
  start() {
    this.option = 'loading';
    this.functions = this.functionsSeconds; //时分秒,时间段
    setTimeout(() => {
      this.option = {
        grid: {
          top: '50px',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          backgroundColor: 'rgba(23,35,61,0.85)',
          padding: 12
        },
        legend: {
          type: 'scroll',
          top: '10px',
          itemHeight: 4,
          textStyle: {
            padding: [0, 0, 2, 3],
            color: ' rgba(23,35,61,0.75)',
            fontFamily: 'PingFangSC-Regular',
            lineHeight: 20
          },
          borderRadius: 4,
          data: ['app store', '未知', '小米应用商城', 'Windows Phone 应用商店'],
          icon: 'roundRect',
          itemWidth: 16,
          right: '0%',
          itemGap: 16
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          axisLabel: {
            color: 'rgba(0,0,0,.7)',
            fontFamily: 'Roboto-Regular'
          },
          data: [
            '04/01',
            '04/02',
            '04/03',
            '04/04',
            '04/05',
            '04/06',
            '04/07',
            '04/08',
            '04/09',
            '04/10',
            '04/11',
            '04/12',
            '04/13',
            '04/14',
            '04/15',
            '04/16',
            '04/17',
            '04/18',
            '04/19',
            '04/20',
            '04/21',
            '04/22',
            '04/23',
            '04/24',
            '04/25',
            '04/26',
            '04/27',
            '04/28',
            '04/29',
            '04/30'
          ],
          nameTextStyle: {
            fontFamily: 'Roboto-Regular',
            color: 'rgba(23,35,61,0.55)',
            lineHeight: 20
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: ['0', '23%'],
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#80848F',
            fontFamily: 'HelveticaNeue',
            fontSize: 12,
            fontWeight: 'normal'
          }
        },
        series: [
          {
            name: 'app store',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          },
          {
            name: '未知',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          },
          {
            name: '小米应用商城',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          },
          {
            name: 'Windows Phone 应用商店',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          }
        ],
        color: [
          'rgba(45,140,240,1)',
          'rgba(0,210,179,1)',
          'rgba(251,169,0,1)',
          'rgba(242,112,54,1)',
          'rgba(181,40,81,1)',
          'rgba(45,51,138,1)',
          'rgba(172,63,192,1)',
          'rgba(102,58,183,1)',
          'rgba(67,86,205,1)',
          'rgba(16,157,88,1)',
          'rgba(123,179,66,1)',
          'rgba(191,197,33,1)'
        ]
      };
    }, 2000);
  }
  end() {
    this.option = 'loading';
    this.functions = this.functionsValue; //百分号
    setTimeout(() => {
      this.option = {};
    }, 2000);
  }
  three() {
    this.option = 'loading';
    this.functions = this.functionsValue; //百分号
    setTimeout(() => {
      this.option = {
        grid: {
          top: '50px',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          backgroundColor: 'rgba(23,35,61,0.85)',
          padding: 12
        },
        legend: {
          type: 'scroll',
          top: '10px',
          itemHeight: 4,
          textStyle: {
            padding: [0, 0, 2, 3],
            color: ' rgba(23,35,61,0.75)',
            fontFamily: 'PingFangSC-Regular',
            lineHeight: 20
          },
          borderRadius: 4,
          data: ['app store', '未知', '小米应用商城', 'Windows Phone 应用商店'],
          icon: 'roundRect',
          itemWidth: 16,
          right: '0%',
          itemGap: 16
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          axisLabel: {
            color: 'rgba(0,0,0,.7)',
            fontFamily: 'Roboto-Regular'
          },
          data: [
            '04/01',
            '04/02',
            '04/03',
            '04/04',
            '04/05',
            '04/06',
            '04/07',
            '04/08',
            '04/09',
            '04/10',
            '04/11',
            '04/12',
            '04/13',
            '04/14',
            '04/15',
            '04/16',
            '04/17',
            '04/18',
            '04/19',
            '04/20',
            '04/21',
            '04/22',
            '04/23',
            '04/24',
            '04/25',
            '04/26',
            '04/27',
            '04/28',
            '04/29',
            '04/30'
          ],
          nameTextStyle: {
            fontFamily: 'Roboto-Regular',
            color: 'rgba(23,35,61,0.55)',
            lineHeight: 20
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: ['0', '23%'],
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#80848F',
            fontFamily: 'HelveticaNeue',
            fontSize: 12,
            fontWeight: 'normal'
          }
        },
        series: [
          {
            name: 'app store',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          },
          {
            name: '未知',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          },
          {
            name: '小米应用商城',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          },
          {
            name: 'Windows Phone 应用商店',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          }
        ],
        color: [
          'rgba(45,140,240,1)',
          'rgba(0,210,179,1)',
          'rgba(251,169,0,1)',
          'rgba(242,112,54,1)',
          'rgba(181,40,81,1)',
          'rgba(45,51,138,1)',
          'rgba(172,63,192,1)',
          'rgba(102,58,183,1)',
          'rgba(67,86,205,1)',
          'rgba(16,157,88,1)',
          'rgba(123,179,66,1)',
          'rgba(191,197,33,1)'
        ]
      };
    }, 2000);
  }
  four() {
    this.option = 'loading';
    this.functions = this.functionsPercent; //时分秒,时间段
    setTimeout(() => {
      this.option = {
        grid: {
          top: '50px',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          backgroundColor: 'rgba(23,35,61,0.85)',
          padding: 12
        },
        legend: {
          type: 'scroll',
          top: '10px',
          itemHeight: 4,
          textStyle: {
            padding: [0, 0, 2, 3],
            color: ' rgba(23,35,61,0.75)',
            fontFamily: 'PingFangSC-Regular',
            lineHeight: 20
          },
          borderRadius: 4,
          data: ['app store', '未知', '小米应用商城', 'Windows Phone 应用商店'],
          icon: 'roundRect',
          itemWidth: 16,
          right: '0%',
          itemGap: 16
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          axisLabel: {
            color: 'rgba(0,0,0,.7)',
            fontFamily: 'Roboto-Regular'
          },
          data: [
            '04/01',
            '04/02',
            '04/03',
            '04/04',
            '04/05',
            '04/06',
            '04/07',
            '04/08',
            '04/09',
            '04/10',
            '04/11',
            '04/12',
            '04/13',
            '04/14',
            '04/15',
            '04/16',
            '04/17',
            '04/18',
            '04/19',
            '04/20',
            '04/21',
            '04/22',
            '04/23',
            '04/24',
            '04/25',
            '04/26',
            '04/27',
            '04/28',
            '04/29',
            '04/30'
          ],
          nameTextStyle: {
            fontFamily: 'Roboto-Regular',
            color: 'rgba(23,35,61,0.55)',
            lineHeight: 20
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: ['0', '23%'],
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(23,35,61,0.10)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#80848F',
            fontFamily: 'HelveticaNeue',
            fontSize: 12,
            fontWeight: 'normal'
          }
        },
        series: [
          {
            name: 'app store',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          },
          {
            name: '未知',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          },
          {
            name: '小米应用商城',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          },
          {
            name: 'Windows Phone 应用商店',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
            type: 'line',
            smooth: true
          }
        ],
        color: [
          'rgba(45,140,240,1)',
          'rgba(0,210,179,1)',
          'rgba(251,169,0,1)',
          'rgba(242,112,54,1)',
          'rgba(181,40,81,1)',
          'rgba(45,51,138,1)',
          'rgba(172,63,192,1)',
          'rgba(102,58,183,1)',
          'rgba(67,86,205,1)',
          'rgba(16,157,88,1)',
          'rgba(123,179,66,1)',
          'rgba(191,197,33,1)'
        ]
      };
    }, 2000);
  }
}
