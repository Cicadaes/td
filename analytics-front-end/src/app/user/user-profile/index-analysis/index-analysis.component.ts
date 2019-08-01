import { Component, Input, Output, EventEmitter, Injector, OnInit } from '@angular/core';
import * as extend from 'extend';
import * as differenceInDays from 'date-fns/difference_in_days';
import { BaseComponent } from '../../../common/base-component';

let $scope;

@Component({
  selector: 'app-index-analysis',
  templateUrl: './index-analysis.component.html',
  styleUrls: ['./index-analysis.component.less']
})
export class IndexAnalysisComponent extends BaseComponent implements OnInit {
  handlerDateDisabled: any;
  xAxisData: any = [];

  _today: any = new Date();
  looading = false;
  _dateRangeOld: any;
  _longRangeSearchLoading: boolean = true; //指标按照下拉框下拉框懒加载loading

  public vm = {
    header: {
      title: '指标分析'
    },

    condition: {
      eventName: '按照',
      eventPropName: '的',
      frequencyName: '按',
      lookUp: '查看',
      dateRange: [],
      eventSelected: { label: '', value: -1 },
      eventSelect: [],
      eventPropSelected: { label: '', value: -1 },
      eventPropSelect: [],
      frequencySelected: { label: '', value: '' },
      frequencySelect: []
    },

    chart: {
      type: 'line',
      data: [],
      option: {},
      loading: true
    }
  };

  public chartOption = {
    color: ['#3591f0'],

    grid: {
      left: 10,
      right: 30,
      top: 30,
      bottom: 16,
      containLabel: true
    },

    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        for (let i = 0; i < $scope.xAxisData.length; i++) {
          const dateArr = $scope.xAxisData[i].split('/');
          if (dateArr[dateArr.length - 1] < 10 && dateArr[dateArr.length - 1].length === 1) {
            dateArr[dateArr.length - 1] = '0' + dateArr[dateArr.length - 1];
          }
          $scope.xAxisData[i] = dateArr.join('/');

          if ($scope.xAxisData[i].substr($scope.xAxisData[i].length - 5) === params[0].axisValue) {
            return `${$scope.xAxisData[i]}<br />${params[0].marker}${params[0].data}`;
          }
        }
      }
    },

    legend: {
      type: 'scroll',
      itemWidth: 10,
      itemHeight: 10,
      right: 10,
      top: 0,
      data: [],
      textStype: { color: '#676c7a', fontSize: 12 },
      formatter: function(name: any) {
        if (name.length > 20) {
          return name.substring(0, 20) + '...';
        } else {
          return name;
        }
      },
      tooltip: {
        show: true,
        confine: true,
        formatter: function(obj: any) {
          return obj.name;
        }
      }
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        splitLine: { lineStyle: { color: '#e9eaec' } },
        axisLine: { lineStyle: { color: '#dddee1' } },
        axisTick: { lineStyle: { color: '#dddee1' }, alignWithLabel: true },
        axisLabel: { color: '#80848f' },
        data: []
      }
    ],

    yAxis: [
      {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#80848f',
          fontSize: 12
          // formatter: function ($value, $i) {
          //     return ($value / 1000) + 'K'：
          // }
        }
      }
    ],

    series: [
      {
        name: '',
        type: '',
        // showSymbol      : false,
        // smooth          : true,
        // silent          : true,
        symbol: 'none',
        data: []
      }
    ]
  };

  @Input()
  private set dateRange($value: any) {
    const vm = $scope.vm;

    if ($value) {
      vm.condition.dateRange = extend(true, [], $value);
      this._dateRangeOld = vm.condition.dateRange;
    }
  }

  @Input()
  private set eventSelected($value: any) {
    const vm = $scope.vm;

    if ($value) {
      vm.condition.eventSelected = extend(true, {}, $value);
    }
  }

  @Input()
  private set eventSelect($value: any) {
    const vm = $scope.vm;

    if ($value) {
      vm.condition.eventSelect = extend(true, [], $value);
    }
  }

  @Input()
  private set eventPropSelected($value: any) {
    const vm = $scope.vm;

    if ($value) {
      vm.condition.eventPropSelected = extend(true, {}, $value);
    }
  }

  @Input()
  private set eventPropSelect($value: any) {
    const vm = $scope.vm;

    if ($value) {
      vm.condition.eventPropSelect = extend(true, [], $value);
    }
  }

  @Input()
  private set frequencySelected($value: any) {
    const vm = $scope.vm;

    if ($value) {
      vm.condition.frequencySelected = extend(true, {}, $value);
    }
  }
  @Input()
  private set longRangeSearchLoading(data: any) {
    this._longRangeSearchLoading = data;
  }

  @Input()
  private set frequencySelect($value: any) {
    const vm = $scope.vm;

    if ($value) {
      vm.condition.frequencySelect = extend(true, [], $value);
    }
  }

  @Input()
  private set chartData($value: any) {
    const vm = $scope.vm;
    $value = $value || [];
    vm.chart.data = extend(true, [], $value);
    $scope.handlerChartOption();
    vm.chart.loading = false;
    this.looading = false;
  }

  @Output() private $EventChange = new EventEmitter();
  @Output() private $EventPropChange = new EventEmitter();

  @Output() private $LookUp = new EventEmitter();
  @Output() private onSearchEvent = new EventEmitter();
  @Output() private getEventList = new EventEmitter();

  constructor(private injector: Injector) {
    super(injector);
    $scope = this;
  }

  ngOnInit() {
    const dateLong = new Date().getTime() - 86400000;
    const date2 = new Date(dateLong);
    this.handlerDateDisabled = (current: Date): boolean => {
      return differenceInDays(current, date2) > 0;
    };
  }

  handlerChartOption() {
    this.looading = false;
    $scope.chartOption.series[0].data = [];
    $scope.chartOption.xAxis[0].data = [];
    const vm = $scope.vm,
      chartOption = $scope.chartOption;
    let a, b, c, i;

    for (a = [], b = [], i = 0; (c = vm.chart.data[i]); i++) {
      // 值
      a.push(c.value);

      // 水平轴
      b.push(c.label);
    }

    // 如果是折线图
    // 那么替换横轴的最后一个 Label
    // if (vm.chart.type === 'line') b.splice(-1, 1, '');
    chartOption.series[0].name = c = vm.condition.eventPropSelected.label;
    chartOption.series[0].cursor = 'default';
    chartOption.legend.data = [c];
    chartOption.series[0].type = vm.chart.type;
    for (let index = 0; index < b.length; index++) {
      const dateArr = b[index].split('/');
      if (dateArr[dateArr.length - 1] < 10 && dateArr[dateArr.length - 1].length === 1) {
        dateArr[dateArr.length - 1] = '0' + dateArr[dateArr.length - 1];
      }
      b[index] = dateArr.join('/');

      chartOption.xAxis[0].data.push(b[index].substr(b[index].length - 5));
    }
    chartOption.series[0].data = a;
    this.xAxisData = b;

    if (a.length > 1) {
      chartOption.series[0].symbol = 'none';
    } else {
      chartOption.series[0].symbol = 'circle';
      chartOption.series[0]['symbolSize'] = [6, 6];
    }
    vm.chart.option = extend(true, {}, chartOption);
  }

  handlerChartTypeChange($type: any) {
    const vm = $scope.vm;

    if (vm.chart.type !== $type) {
      (vm.chart.type = $type), $scope.handlerChartOption();
    }
  }

  handlerEventChange($value: any) {
    const vm = $scope.vm;
    let a, i;

    for (i = 0; (a = vm.condition.eventSelect[i]); i++) {
      if (a.value === $value) {
        break;
      }
    }

    $scope.$EventChange.emit(a);
  }

  handlerEventPropChange($value: any) {
    const vm = $scope.vm;
    let a, i;

    for (i = 0; (a = vm.condition.eventPropSelect[i]); i++) {
      if (a.value === $value) {
        break;
      }
    }

    $scope.$EventPropChange.emit(a);
  }

  handlerDateRangeChange($date: any) {
    const vm = $scope.vm;
    const days = this.globals.getDateDays(vm.condition.dateRange[0], vm.condition.dateRange[1]);
    if (days > 365) {
      setTimeout(() => {
        (vm.condition.dateRange = this._dateRangeOld), $scope.handlerLookUp(false);
      }, 100);
      this.message.create('warning', '时间范围不能超过一年');
      return false;
    }
    (vm.condition.dateRange = $date), $scope.handlerLookUp(true);
  }

  handlerLookUp(loading: boolean) {
    this.looading = loading;
    const vm = $scope.vm;
    $scope.$LookUp.emit({
      dateRange: vm.condition.dateRange,
      eventSelected: vm.condition.eventSelected,
      eventPropSelected: vm.condition.eventPropSelected,
      frequencySelected: vm.condition.frequencySelected
    });

    vm.chart.loading = true;
  }
  /**
   * 指标按照下拉框下拉框文案搜索变化
   */
  _onSearchEvent(data: any) {
    $scope.onSearchEvent.emit(data);
  }
  /**
   * 指标按照下拉框下拉框分页
   */
  _getEventList(data: any) {
    $scope.getEventList.emit(data);
  }
}
