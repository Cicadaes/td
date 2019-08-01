import { Component, OnInit, Input, Injector } from '@angular/core';
import { EChartOption } from 'echarts';
import { format } from 'date-fns';
import { AppErrorBase } from '../app-error-base';

@Component({
  selector: 'app-error-tend',
  templateUrl: './app-error-tend.component.html',
  styleUrls: ['./app-error-tend.component.less']
})
export class AppErrorTendComponent extends AppErrorBase implements OnInit {
  chartOption: EChartOption;
  chartObject: EChartOption;

  _tendOptions: any;
  tendType = 'errorTimes';
  tendTypeName = '错误次数';
  flag = false;

  tabList = [
    {
      label: '错误次数',
      value: 'errorTimes'
    },
    {
      label: '错误率',
      value: 'errorRatio'
    },
    {
      label: '影响用户数',
      value: 'affectUsers'
    },
    {
      label: '影响用户率',
      value: 'affectRatio'
    }
  ];

  @Input() set tendOptions(value: any) {
    if (value && Object.keys(value).length) {
      this._tendOptions = value;
      this.processData(value[this.tendType]);
    }
  }

  @Input() set tabLength(value: any) {
    if (value) {
      this.tabList = [
        {
          label: '错误次数',
          value: 'errorTimes'
        },
        {
          label: '影响用户数',
          value: 'affectUsers'
        }
      ];
    }
  }

  @Input() loading = false;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    const that = this;
    this.chartObject = {
      legend: {
        top: 6,
        right: 14,
        icon: 'rect',
        itemWidth: 16,
        itemHeight: 4,
        padding: 0,
        itemGap: 10,
        color: '#2D8CF0'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params, ticket, callback) {
          let str = `${params[0].axisValue}<br />${params[0].marker} ${params[0].seriesName} ${params[0].data}`;
          if (that.tendType === 'errorRatio' || that.tendType === 'affectRatio') {
            str = `${params[0].axisValue}<br />${params[0].marker} ${params[0].seriesName} ${params[0].data}` + '%';
          }
          return str;
        }
      },
      xAxis: {},
      yAxis: {
        type: 'value',
        axisLabel: {}
      },
      grid: {
        top: 36,
        left: 0,
        bottom: 0,
        right: 14,
        containLabel: true
      }
    };
  }

  // 点击错误趋势tabs时的回调
  changeTab(item: any) {
    this.tendType = item.value;
    this.tendTypeName = item.label;
    this.processData(this._tendOptions[this.tendType]);
  }

  // 处理图表数据
  processData(data: any) {
    const xAxis = [],
      seriesData = [];
    this.flag = false;
    if (!data.length) {
      this.flag = true;
      return;
    }
    data.forEach(element => {
      xAxis.push(format(new Date(element.date), 'MM/DD'));
      let value;
      if (this.tendType === 'errorRatio' || this.tendType === 'affectRatio') {
        value = (element.value * 100).toFixed(2);
      } else {
        value = element.value;
      }
      seriesData.push(value);
    });

    this.chartObject.legend['data'] = [this.tendTypeName];

    this.chartObject.xAxis['data'] = xAxis;
    this.chartObject.series = [
      {
        name: this.tendTypeName,
        type: 'line',
        smooth: true,
        data: seriesData
      }
    ];
    if (this.tendType === 'errorRatio' || this.tendType === 'affectRatio') {
      this.chartObject.yAxis['axisLabel']['formatter'] = '{value} %';
    } else {
      this.chartObject.yAxis['axisLabel']['formatter'] = '{value}';
    }

    this.chartOption = this.processChartData(this.chartObject, false);
    this.chartOption.legend['data'] = [this.tendTypeName];

    // console.log(JSON.stringify(this.chartOption))
    // console.log(this.chartOption)
  }
}
