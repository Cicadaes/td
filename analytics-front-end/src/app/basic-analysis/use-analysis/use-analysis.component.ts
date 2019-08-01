import { Component, OnInit, Injector } from '@angular/core';
import { EChartOption } from 'echarts';
import { BaseUseAnalysis } from './base-use-analysis';
import { UseAnalysisService } from './use-analysis.service';

@Component({
  selector: 'app-use-analysis',
  templateUrl: './use-analysis.component.html',
  styleUrls: ['./use-analysis.component.less']
})
export class UseAnalysisComponent extends BaseUseAnalysis implements OnInit {
  chartOption: EChartOption;
  showType: number = 1;
  moreSearchFlag: boolean; // 筛选下拉
  selectLoading = false; // 下拉列表loading
  selectPage: number; // 下拉列表分页
  selectCount: number; // 下拉列表总条数

  listOfSelectedValue = [];
  attributeList = []; // 属性列表
  attributeValueList = []; // 属性值列表

  // 筛选信息
  filterInfo = {
    dateRange: [], // 日期
    selectedAttr: '', // 选中的属性
    selectedAttrValue: [], // 选中的属性值
    operator: 'in' // 属性与属性值之间的关系
  };

  // 查询接口参数
  searchParam = {};

  constructor(public injector: Injector, public useAnalysisService: UseAnalysisService) {
    super(injector);
  }

  ngOnInit() {
    const tempTime = new Date();
    const endTime = new Date(tempTime.getTime() - 6 * 24 * 3600 * 1000);
    this.filterInfo.dateRange.push(endTime);
    this.filterInfo.dateRange.push(tempTime);

    this.getAttributes();
    this.searchByFilter();
  }

  /**
   * 切换tabs
   * @param event
   */
  changeTab(event: number) {
    if (this.showType != event) {
      this.showType = event;
    }
  }

  /**
   * 改变选中的属性时，获取属性值
   * @param event
   */
  changeAttr(event?: any) {
    this.attributeValueList = [];
    this.filterInfo.selectedAttrValue = [];
    this.useAnalysisService.getAttributeValue(event['dicKey']).subscribe(res => {
      if (res['success']) {
        this.attributeValueList = res['data'];
        this.selectCount = res['total'];
        this.selectPage = 1;
      }
    });
  }

  // 改变时间
  timeChange(date: any) {
    this.filterInfo.dateRange = date;
    this.searchByFilter();
  }

  /**
   * 点击筛选
   * @param event
   */
  moreSearch() {
    this.moreSearchFlag = !this.moreSearchFlag;
    // 收起筛选时，筛选条件只传时间间隔
    if (!this.moreSearchFlag) {
      this.searchParam = {
        startDate: this.globals.dateFormat(this.filterInfo['dateRange'][0], ''),
        endDate: this.globals.dateFormat(this.filterInfo['dateRange'][1], ''),
        productId: localStorage.getItem('productId')
      };
      this.filterInfo.selectedAttrValue = [];
    }
  }

  /**
   * 查询按钮触发
   */
  searchByFilter() {
    this.searchParam = {
      startDate: this.globals.dateFormat(this.filterInfo['dateRange'][0], ''),
      endDate: this.globals.dateFormat(this.filterInfo['dateRange'][1], ''),
      code: this.filterInfo['selectedAttr']['code'],
      operator: this.filterInfo['operator'],
      value: this.filterInfo['selectedAttrValue'],
      productId: localStorage.getItem('productId')
    };
  }

  /**
   * 下拉选择框加载更多
   */
  loadMore() {
    if (Math.ceil(this.selectCount / 20) > this.selectPage) {
      this.selectLoading = true;
      this.useAnalysisService
        .getAttributeValue(this.filterInfo.selectedAttr['dicKey'], this.selectPage++)
        .subscribe(res => {
          this.selectLoading = false;
          if (res['success']) {
            this.attributeValueList = [...this.attributeValueList, ...res['data']];
          }
        });
    }
  }

  /**
   * 获取属性列表
   */
  getAttributes() {
    this.useAnalysisService.getAttributes().subscribe((res: any) => {
      this.attributeList = res;
      if (res) {
        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          if (element['child'].length > 0) {
            this.filterInfo['selectedAttr'] = element['child'][0];
            this.changeAttr(element['child'][0]);
            break;
          }
        }
      }
    });
  }
}
