import { BaseComponent } from 'src/app/common/base-component';
import { Injector } from '@angular/core';
import { EChartOption } from 'echarts';

import { TABLE_PAGE_SIZE_OPTIONS } from '../../common/config/page.size.config';
import cloneDeep from 'lodash/cloneDeep';

export class BaseUseAnalysis extends BaseComponent {
  pageOptions = TABLE_PAGE_SIZE_OPTIONS;
  _searchParam: any = {}; // 查询的参数

  tableData = []; // 表格数据
  totalCount: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  // 排序对象
  sortMap = {
    date: null,
    value: null
  };

  constructor(injector: Injector) {
    super(injector);
  }

  processChartOption(option: EChartOption) {
    option['grid'] = {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    };
    delete option['legend'];
    delete option['yAxis']['boundaryGap'];
    return option;
  }

  /**
   * 处理筛选器的参数
   * @param searchParam
   */
  processSearchParam(searchParam: any) {
    let param = {};
    if (searchParam['code'] && searchParam['value'].length > 0) {
      Object.assign(param, searchParam);
    } else {
      param = {
        startDate: searchParam['startDate'],
        endDate: searchParam['endDate'],
        productId: searchParam['productId']
      };
    }
    return param;
  }

  /**
   * 将时间数据分割式格式化 20001010 return 2000-10-10
   * @param value
   */
  dateSplit(value: string) {
    return `${value.substr(0, 4)}-${value.substr(4, 2)}-${value.substring(6)}`;
  }

  /**
   * 表格排序按钮触发
   * @param sort
   */
  sort(sort: { key: string; value: string }): void {
    for (const key in this.sortMap) {
      this.sortMap[key] = key === sort.key ? this.sortMap[key] : null;
    }
    if (sort.key && sort.value) {
      this.tableData.sort((a, b) =>
        sort.value === 'ascend' ? (a[sort.key!] > b[sort.key!] ? 1 : -1) : b[sort.key!] > a[sort.key!] ? 1 : -1
      );
    }

    this.tableData = cloneDeep(this.tableData);
  }

  /**
   * 处理柱图数据
   * @param res 请求返回的数据
   * @param constantMap 图表x轴显示文案
   * @param formatterFun  tooltip的显示formatter
   */
  processBarData(res: any, constantMap: Object, formatterFun: any) {
    if (res['success'] && res['list'] && JSON.stringify(res['list']) != '{}') {
      let resData = res['list'],
        charData = [],
        chartText = [],
        xMax = 5, // 预设一个最大的值
        shadowList = [];
      for (const key in constantMap) {
        if (constantMap.hasOwnProperty(key)) {
          const element = constantMap[key];
          chartText.push(element);
          charData.push(resData[key] || 0);
          if (resData[key] > xMax) {
            xMax = resData[key];
          }
        }
      }
      charData.forEach(() => {
        shadowList.push(xMax);
      });
      return this.processChartOption(
        this.chartMergeReturnOption(
          'lineBar',
          {
            tooltip: {
              trigger: 'axis',
              formatter: formatterFun
            },
            series: [
              {
                type: 'bar',
                barGap: 0,
                data: charData.reverse()
              },
              {
                type: 'bar',
                itemStyle: {
                  normal: { color: 'rgba(0,0,0,0.05)' }
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: shadowList
              }
            ],
            yAxis: {
              data: chartText.reverse()
            },
            xAxis: {
              max: xMax
            }
          },
          true
        )
      );
    } else {
      return null;
    }
  }

  /**
   * 处理线图和表格
   * @param res
   * @param formatterFun
   */
  processLineAndTable(res: any, formatterFun: any) {
    this.tableData = [];
    if (res['success'] && res['list'] && JSON.stringify(res['list']) != '{}') {
      let resData = res['list'],
        charData = [],
        chartText = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          chartText.push(`${key.substr(4, 2)}/${key.substr(6, 2)}`);
          charData.push(resData[key]);
          this.tableData.push({
            date: key,
            value: resData[key]
          });
        }
      }
      this.tableData.reverse(); // 默认倒序

      return this.processChartOption(
        this.chartMergeReturnOption('lineBar', {
          tooltip: {
            trigger: 'axis',
            formatter: formatterFun
          },
          series: [
            {
              type: 'line',
              barGap: 0,
              smooth: true,
              data: charData
            }
          ],
          xAxis: {
            data: chartText
          },
          yAxis: {
            minInterval: 1
          }
        })
      );
    }
  }

  /**
   * 跳转到下载页面
   * @param url
   */
  goPage(url: string) {
    this.commonService.goPage(url);
  }
}
