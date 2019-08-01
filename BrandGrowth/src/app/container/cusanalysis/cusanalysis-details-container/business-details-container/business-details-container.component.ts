import { Component, OnInit } from '@angular/core';

import { ApiCommonComponent } from '../api-common.component';

@Component({
  selector: 'business-details-container',
  templateUrl: './business-details-container.component.html',
  styleUrls: ['./business-details-container.component.less']
})
export class BusinessDetailsContainerComponent implements ApiCommonComponent, OnInit {

  private _formatNull = () => '';

  private catDistributionIndex: any = null; // 类别分布占比
  private catTgiIndex: any = null; // tgi雷达图
  private catTgiIndexRank: any[] = []; // tgi 排行数据
  private chartBarConfig: any = null; // 电商网购指数
  private primaryFeature: any = []; // 人群特征
  private appIndex: any = []; // 应用触达
  private noTableResult: string = '加载中...'; // 表格无数据时暂时内容
  private appSelect: string = ''; // 选择的筛选项
  private appSelectOptions: any = []; // 筛选项内容 

  constructor() { }

  ngOnInit() {
  }

  // 初始化组件
  resetMove(data?: any) {
    const info = data && data.eCommercePortrait ? data.eCommercePortrait : null;
    this.setData(info);
  }

  // 清空当前页面数据
  clearData() {
  }

  setData(data?: any) {
    this.primaryFeature = data.primaryFeature;
    this.catTgiIndexRank = data.catTgiIndex;
    this.catTgiIndex = this.setTgiData(data.catTgiIndex);
    this.chartBarConfig = this.setBarData(data.shoppingIndex);
    this.appIndex = data.appIndex;
    this.catDistributionIndex = this.setPieData(data.catDistributionIndex);
    this.getSelectOption();
  }

  setTgiData(data: any) {
    const value = data.map((x: any) => (x.count));
    const name = data.map((x: any) => (x.name));
    const max = data.sort((x: any, y: any) => (y.count - x.count))[0].count || 100;
    const indicator = name.map((x: any) => {
      return {
        name: x,
        max,
      };
    });
    return {
      radar: {
        indicator,
      },
      series: {
        data: [
          {
            value,
            name: '类别TGI指数',
          },
        ],
      },
    };
  };

  setBarData(data: any) {
    let list: any[] = [];
    if (data) {
      list = data.map((x: any) => {
        return {
          name: x.name,
          value: x.count,
        };
      })
    }
    return {
      legend: {
        show: false,
      },
      tooltip : {
        trigger: 'axis',
        axisPointer : {
          lineStyle: {
            opacity: 0,
          },
        },
        formatter: '{b}: {c}',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        textStyle: {
          color: 'rgba(28,36,56,0.80)',
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,  
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        data: ['aaa', 'bbb', 'ccc', 'ddd']
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,  
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      series: {
        type: 'bar',
        barWidth: 12,
        itemStyle: {
          color: '#F1F3F5',
          emphasis: {
            color: '#3399ff',
          },
        },
        data: list,
      },
    };
  }

  setPieData(data: any) {
    let value: any = [];
    if (!!data) {
      value = data.map((x: any) => {
        return {
          name: x.name || '',
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

  // 初始化获取表格筛选项的内容
  getSelectOption() {
    const a = this.appIndex.map((x: any) => (x.cat));
    const b = Array.from(new Set(a));
    const list = b.map((x: any) => {
      return {
        label: x,
        value: x,
      };
    });
    list.unshift({
      label: '全部',
      value: '全部',
    });
    this.appSelect = '全部';
    this.appSelectOptions = list;
  }
}
