import { Component, OnInit } from '@angular/core';

import { ApiCommonComponent } from '../api-common.component';

import { numberPercent } from '../../../../utils/number-percent';

@Component({
  selector: 'app-base-details-container',
  templateUrl: './base-details-container.component.html',
  styleUrls: ['./base-details-container.component.less'],
})
export class BaseDetailsContainerComponent implements ApiCommonComponent, OnInit {

  private maleAndAgeIndex: any = {}; // 男性分布数据
  private femaleAndAgeIndex: any = {}; // 女性分布数据
  private married: any = {}; // 已婚分布数据
  private carsOwner: any = {}; // 有车分布数据
  private ageIndex: any = []; // 年龄分布数据
  private areas: any[] = []; // 地域分布数据
  private cities: any[] = []; // 城市数据
  private cityDistributes: any = null; // 线级城市分布数据

  constructor(
  ) { }

  ngOnInit() {
    this.setData();
  }

  // 初始化组件
  resetMove(data: any) {
    const info = data && data.baseMetrics ? data.baseMetrics : null;
    this.setData(info);
  }

  /**
   * 设置基础属性数据
   * @param info [接口返回的数据]
   */
  setData(info?: any) {
    // 当 info 为空是重置当前页面数据
    const value = info ? info : {
      maleAndAgeIndex: false,
      femaleAndAgeIndex: false,
      married: false,
      carsOwner: false,
      ageIndex: [],
      areas: [],
      cities: [],
      cityDistributes: [],
    };
    this.maleAndAgeIndex = this.setProgressAndAgeData('男性', value.maleAndAgeIndex);
    this.femaleAndAgeIndex = this.setProgressAndAgeData('女性', value.femaleAndAgeIndex);
    this.married = this.setProgressData('已婚', value.married);
    this.carsOwner = this.setProgressData('有车', value.carsOwner);
    this.ageIndex = this.setAgeChartData(value.ageIndex);
    this.areas = value.areas.map((x: any) => {
      return {
        name: x.name,
        value: x.count,
      };
    });
    this.cities = value.cities.map((x: any) => {
      return {
        name: x.name,
        value: x.percent,
      };
    });
    this.cityDistributes = this.setPieData(value.cityDistributes);
  }

  /**
   * 处理进度条图表包含列表的数据
   * @param name [图表名称]
   * @param data [图表的数据]
   */
  setProgressAndAgeData(name?: string, data?: any) {
    let value: any[] = [];
    let info = {
      key: this.setProgressData(name),
      value,
    };

    if (!!data) {
      const count = data.value.reduce((x: number, y: any) => {
        return x + Number(y.count);
      }, 0);
      value = data.value.map((x: any) => {
        return {
          name: x.name,
          percent: (x.count / count),
        };
      })
      info = {
        key: data.key,
        value,
      };
    }
    return info;
  }

  /**
   * 处理进度条图表的数据
   * @param name [图表名称]
   * @param data [图表数据]
   */
  setProgressData(name?: string, data?: any) {
    let info = {
      name,
      percent: 0,
    };

    if (!!data) {
      info = data;
    }
    return info;
  }

  // 设置年龄图表数据
  setAgeChartData(data: any) {
    let axis: any = [];
    let list: any = [];
    if (!!data) {
      const count = data.reduce((x: number, y: any) => {
        return x + y.count;
      }, 0);
      list = data.map((item: any) => {
        axis.push(item.name);
        const value = numberPercent((item.count / count) * 100);
        return {
          name: item.name,
          value: value === 'N/A' ? '0.00' : value,
        };
      })
    }

    return {
      grid: {
        top: 40,
      },
      xAxis: {
        type: 'category',
        data: axis,
        boundaryGap: true,
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'solid'
          }
        },
        axisTick: {
          show: false,  
        },
        axisLabel: {
          show: false,
        },
      },
      tooltip: {
        formatter(params: any) {
          return `
            <p>${params[0].name}</p> 
            <span style="
              width: 12px; 
              height: 12px; 
              display: inline-block; 
              border-radius: 100%;
              background: ${params[0].color}; 
              marsin-right: 10px;"></span>
            ${params[0].value}%
          `;
        }
      },
      series: [
        {
          type: 'bar',
          data: list,
          barWidth: 33,
          label: {
            normal: {
              show: true,
              formatter: '{c}%',
              position: 'top',
            },
          },
        },
      ],
    }
  }

  // 设置饼图数据
  setPieData(data: any) {
    let value: any = [];
    if (!!data) {
      value = data.map((x: any) => {
        return {
          name: x.name,
          value: x.percent,
        };
      });
    }
    return {
      series: {
        type: 'pie',
        data: value,
      },
    };
  }
}
