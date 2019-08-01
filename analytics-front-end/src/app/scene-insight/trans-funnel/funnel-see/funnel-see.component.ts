import * as extend from 'extend';
import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { FunnelSeeService } from './funnel-see.service';
import * as differenceInDays from 'date-fns/difference_in_days';
import { BaseComponent } from '../../../common/base-component';

let $scope;

@Component({
  selector: 'app-funnel-see',
  templateUrl: './funnel-see.component.html',
  styleUrls: ['./funnel-see.component.less'],
  providers: [FunnelSeeService]
})
// zhanghong code
export class FunnelSeeComponent extends BaseComponent implements OnInit, OnChanges {
  public funnelId: any;
  public nls: any;
  public vm: any;
  public chartOption: any;
  _dateFormat = 'yyyy-MM-dd';
  _today = new Date();
  _dateRange: any;
  urlParams: any;
  _selectEventMultiple: any;

  constructor(private funnelSeeService: FunnelSeeService, private injector: Injector) {
    super(injector);

    this.initRouterList('用户档案');

    this.buildUrlParams();
    $scope = this;
  }

  buildUrlParams() {
    this.urlParams = {};
  }

  ngOnInit() {
    $scope.funnelId = $scope.route.snapshot.params['funnelId'];

    $scope.nls = {
      header: '',
      filterLabel: '用户',
      filterButtonAdvanced: '筛选',
      filterButtonColAdvanced: '筛选',
      filterButtonLookUp: '查询',
      filterPropValuePlaceholder: '请选择'
    };

    $scope.vm = {
      filter: {
        date: [],
        propSelect: [],
        propValue: undefined,
        propOperatorSelect: [],
        propOperatorValue: undefined,
        propValueSelect: [],
        propValueValue: undefined,
        advanced: false
      },

      chart: {
        info: {},
        option: {},
        data: [],
        loading: false
      }
    };

    $scope.chartOption = {
      color: [
        '#34508c',
        '#2b85e4',
        '#1cb6fb',
        '#1bdbf5',
        '#80f2da',
        '#c1f9d6',
        '#fcf4ae',
        '#fbe790',
        '#ffbd6e',
        '#fb7b49'
      ],
      title: {
        text: '',
        left: 'center',
        top: '20px',
        textStyle: { color: '#17233d', fontSize: 14 }
      },

      legend: {
        right: '5%',
        show: false,
        y: 'center',
        orient: 'vertical',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 16,
        selectedMode: false,
        textStype: { color: '#676c7a', fontSize: 12 },
        data: []
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(23, 35, 61,0.85)',
        padding: 15,
        extraCssText: `height: 60px;\n    line-height: 30px;\n    padding: 15px 25px;\n    font-size: 12px;`,
        textStyle: {
          color: '#ffffff',
          decoration: 'none',
          fontFamily: '"HelveticaNeue", "PingFangSC", "微软雅黑"',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal'
          /*lineHeight: 50*/
        },
        axisPointer: {
          type: 'line'
        },
        show: true,
        formatter: function(params) {
          let relVal = `<span style="line-height: 10px;
                    display: inline-block;
                    height: 6px;
                    width: 6px;
                    border-radius: 50%;
                    margin-right: 8px;
                    margin-bottom: 1px;
                    background: ${params.color};"></span>`;
          const seriesName = $scope._getDataByIndex(params.dataIndex)['name'];
          relVal += `${seriesName} : ${$scope.globals.toThousands(params.value)}`;
          return relVal;
        }
      },
      series: [
        {
          label: {
            position: 'left',
            fontSize: 12,
            color: '#17233d'
          },
          labelLine: {
            normal: {
              length: 60,
              lineStyle: {
                width: 1,
                type: 'solid',
                color: '#17233d'
              }
            }
          },
          type: 'funnel',
          x: '25%',
          width: '50%',
          itemStyle: { opacity: 0 },
          silent: true,
          data: []
        },
        {
          label: {
            position: 'right',
            textStyle: { color: '#17233d', fontSize: '12', lineHeight: '30' },
            formatter: function(val) {
              let newName = val.name;
              newName = newName
                .replace(/[^\x00-\xff]/g, '$&\x01')
                .replace(/.{20}\x01?/g, '$&\n')
                .replace(/\x01/g, '');
              return newName;
            }
          },
          labelLine: {
            normal: {
              length: 60,
              lineStyle: {
                width: 1,
                type: 'solid',
                color: '#17233d'
              }
            }
          },
          type: 'funnel',
          x: '25%',
          width: '50%',
          silent: true,
          data: []
        },
        {
          /*label: {position: 'center', fontSize: 12},*/
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 1,
              label: {
                position: 'center',
                fontSize: 12,
                show: true,
                formatter: function(param: any) {
                  if (param && param.value > 0) {
                    return $scope.globals.toThousands(param.value);
                  } else {
                    return '0';
                  }
                }
              }
            }
          },
          type: 'funnel',
          x: '25%',
          width: '50%',
          silent: false,
          data: []
        }
      ]
    };

    // 开始
    $scope.initFilter(function() {
      $scope.initFilterValue(function() {
        $scope.initChartData(function() {
          $scope.initChartOption();
        });
      });
    });
  }

  _getDataByIndex(index: any) {
    let data;
    if ($scope.vm.chart && $scope.vm.chart.data && $scope.vm.chart.data.length > 0) {
      const datas = $scope.vm.chart.data;
      for (let i = 0; i < datas.length; i++) {
        if (index === i) {
          data = datas[i];
          break;
        }
      }
    }
    return data;
  }

  _disabledDate = (current: Date): boolean => {
    return differenceInDays(current, this._today) > 0; // || differenceInDays(current, this._today) < -365;
  };

  /**
   * 初始化
   */
  initFilter($next?: any) {
    const _that = this;

    $scope.funnelSeeService.getFilter().subscribe((response: any) => {
      const date = _that.globals.getDateRangeByLastDay(-6);

      const $data = {
        date: [new Date(date.start), new Date(date.end)],
        prop: _that._getFilter_formatProp(response),
        propOperator: _that._getFilter_formatPropOperator()
      };

      $scope._dateRange = $data.date;
      $scope.vm.filter.date = $data.date;
      $scope.vm.filter.propSelect = $data.prop.select;
      $scope.vm.filter.propValue = $data.prop.value;
      $scope.vm.filter.propOperatorSelect = $data.propOperator.select;
      $scope.vm.filter.propOperatorValue = $data.propOperator.value;
      $scope.initSelectEventMultiple();

      // 执行下一步
      if ($next) {
        $next();
      }
    });
  }

  _getFilter_formatProp($data: any) {
    let $a, $b, $c, a, b, i, j;

    for (i in ((a = []), ($a = $data.list))) {
      if ($a[i] && $a[i].length > 0) {
        a.push({
          label: i,
          value: b = []
        });

        for ($b = $a[i], j = 0; ($c = $b[j]); j++) {
          b.push({
            label: $c.displayname,
            value: $c.esfieldname,
            groupKey: i
          });
        }
      }
    }

    let returnData = {
      select: a,
      value: {}
    };
    if (a && a.length > 0 && a[0].value && a[0].value.length > 0) {
      returnData = {
        select: a,
        value: a[0].value[0]
      };
    }
    return returnData;
  }

  _getFilter_formatPropOperator() {
    return {
      select: [
        { label: '等于', value: 'eq' },
        { label: '不等于', value: 'ne' }
        // {label : '包含',　　 value : 'in'},
        // {label : '不包含',　 value : 'notIn'},
        // {label : '大于',　　 value : '>'},
        // {label : '大于等于', value : '>='},
        // {label : '小于',　　 value : '<'},
        // {label : '小于等于', value : '<='},
        // {label : '在区间',　 value : 'between'}
      ],
      value: 'eq'
    };
  }

  initFilterValue($next?: any) {
    if ($scope.vm.filter.propValue) {
      const p = {
        productId: $scope.productId,
        propValue: $scope.vm.filter.propValue['value']
      };
      $scope.vm.filter.propValueValue = null;
      $scope.funnelSeeService.getFilterValue(p).subscribe((response: any) => {
        let a, b, i;
        for (a = [], i = 0; (b = response.list[i]); i++) {
          a.push({
            label: b.dicItemAlias,
            value: b.id
          });
        }
        $scope.vm.filter.propValueSelect = a;

        // 执行下一步
        if ($next) {
          $next();
        }
      });
    }
  }

  initChartData($next?: any) {
    let p = {
      funnelId: $scope.funnelId,
      productId: $scope.productId,
      date: $scope.vm.filter.date,
      advanced: $scope.funnelSeeService.getChartData_advanced($scope.vm.filter)
    };

    $scope.vm.chart.loading = true;
    $scope.funnelSeeService.getChartData(p).subscribe((response: any) => {
      let toDecimal = this.globals.toDecimal;

      let $a, $b, a, b, c, i;
      for (a = [], $a = $b = response.list.list[0], i = 0; (b = response.list.list[i]); $b = b, i++) {
        a.push({
          center: `${b.Y}`,
          left: `累计转化率：${(c = toDecimal(b.Y && (b.Y / $a.Y) * 100))}%\n步骤间的转化率：${toDecimal(
            b.Y && (b.Y / $b.Y) * 100
          )}%`,
          name: b.X,
          value: b.Y
        });
      }
      a.title = `总转化率 ${toDecimal(c)}%`;

      let info = response.list.funnelReport;
      $scope.vm.chart.data = a;
      $scope.vm.chart.loading = false;
      $scope.vm.chart.info = info;
      $scope.nls.header = info.name;

      // 执行下一步
      if ($next) {
        $next();
      }
    });
  }

  initChartOption($next?: any) {
    const vm = $scope.vm,
      chartOption = $scope.chartOption;
    let a, b, c, d, e, i;

    for (a = [], b = [], c = [], e = [], i = 0; (d = vm.chart.data[i]); i++) {
      a.push({
        name: d.left,
        value: d.value
      });

      b.push({
        name: d.name,
        value: d.value,
        itemStyle: { color: chartOption.color[i] }
      });

      e.push({
        name: d.center,
        value: d.value,
        itemStyle: { color: chartOption.color[i] }
      });

      c.push(d.name);
    }
    let aMin = Math.min.apply(
      Math,
      a.map(function(o) {
        return o.value;
      })
    );
    const aMax = Math.max.apply(
      Math,
      a.map(function(o) {
        return o.value;
      })
    );
    if (aMin !== aMax) {
      aMin = 0;
    }

    let bMin = Math.min.apply(
      Math,
      b.map(function(o) {
        return o.value;
      })
    );
    const bMax = Math.max.apply(
      Math,
      b.map(function(o) {
        return o.value;
      })
    );
    if (bMin !== bMax) {
      bMin = 0;
    }

    let eMin = Math.min.apply(
      Math,
      e.map(function(o) {
        return o.value;
      })
    );
    const eMax = Math.max.apply(
      Math,
      e.map(function(o) {
        return o.value;
      })
    );
    if (eMin !== eMax) {
      eMin = 0;
    }

    chartOption.series[0].data = a;
    chartOption.series[0].min = aMin;
    chartOption.series[0].max = aMax;
    chartOption.series[1].data = b;
    chartOption.series[1].min = bMin;
    chartOption.series[1].max = bMax;
    chartOption.series[2].data = e;
    chartOption.series[2].min = eMin;
    chartOption.series[2].max = eMax;
    chartOption.legend.data = c;
    chartOption.title.text = vm.chart.data.title;

    // 渲染
    vm.chart.option = extend({}, true, chartOption);

    // 执行下一步
    if ($next) {
      $next();
    }
  }

  /**
   * 处理改变
   */
  handlerFilter() {
    const days = this.globals.getDateDays($scope.vm.filter.date[0], $scope.vm.filter.date[1]);
    console.dir(days);
    if (days > 365) {
      setTimeout(() => {
        $scope.vm.filter.date = this._dateRange;
      }, 100);
      $scope.message.create('warning', '时间范围不能超过一年');
      return false;
    }
    $scope._dateRange = $scope.vm.filter.date;
    $scope.initChartData(function() {
      $scope.initChartOption();
    });
  }

  handlerFilterAdvanced() {
    if (!($scope.vm.filter.advanced = !$scope.vm.filter.advanced)) {
      $scope.handlerFilter();
    }
  }

  initSelectEventMultiple() {
    if ($scope.vm.filter.propValue) {
      const value = $scope.vm.filter.propValue['value'] || '';
      this._selectEventMultiple = {
        apiUrl: `${this.funnelSeeService.getQueryEventUrl() + value}&rows=20&page=`,
        apiType: 'get',
        apiData: true,
        apiSearch: true,
        keywordFiled: 'searchName',
        apiPaging: true,
        model: 'multiple',
        apiParam: {}
      };
    }
  }

  onSelectEventMultiple(value: any) {
    const idsValue = [];
    if (value && value.length > 0) {
      for (let i = 0; i < value.length; i++) {
        idsValue.push(value[i].value);
      }
    }
    $scope.vm.filter.propValueValue = idsValue;
  }

  handlerFilterPropChange() {
    $scope.initSelectEventMultiple();
    $scope.initFilterValue();
  }
}
