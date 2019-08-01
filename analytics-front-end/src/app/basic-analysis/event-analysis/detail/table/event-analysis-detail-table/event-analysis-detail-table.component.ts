import { Component, Injector, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EventAnalysisService } from '../../../event-analysis.service';
import { BaseComponent } from '../../../../../common/base-component';

@Component({
  selector: 'app-event-analysis-detail-table',
  templateUrl: './event-analysis-detail-table.component.html',
  styleUrls: ['./event-analysis-detail-table.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisDetailTableComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() detailData: any;
  @Input() isQueringData: any;
  @Input() chartType: any;
  @Input() contrast: any;
  @Input() selectedMetric: any;
  @Input() queryAllParams: any;
  _current = 1; // 当前页
  _pageSize = 10; // 每页条数
  _total = 1; // 数据总量
  pageSizeOptions: any;
  scroll = '1000px';
  dataTotalArr: any = [];

  constructor(public service: EventAnalysisService, private injector: Injector) {
    super(injector);
    this.pageSizeOptions = this.table_page_size_options;
  }

  _getItemByIndex(list: any[], index: any) {
    let item;
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (i === index) {
          item = list[i];
          break;
        }
      }
    }
    return item;
  }

  goUserPage(data: any, index: any, rowIndex: any) {
    let queryParams = this.queryAllParams.json || {};
    if (this.contrast && rowIndex % 2 == 1) {
      queryParams = this.queryAllParams.jsonContrast || {};
    }
    if (this.chartType === 'bar') {
      queryParams.dicItems = [data[0]];
    } else {
      data[0] != '合计' ? (queryParams.startDate = data[0]) : false;
      data[0] != '合计' ? (queryParams.endDate = data[0]) : false;
      const item = this._getItemByIndex(this.detailData.head, index);
      if (item && item.id) {
        queryParams.dicItems = [item.id];
      }
    }
    this.goToPage('用户列表', '/scene-insight/advanced-trans-funnel/users', {
      queryParams: JSON.stringify(queryParams),
      pageSource: 'behavior-analysis'
    });
  }

  goTotalUserPage(index: any, rowIndex: any) {
    let queryParams = this.queryAllParams.json || {};
    if (this.contrast && rowIndex % 2 == 1) {
      queryParams = this.queryAllParams.jsonContrast || {};
    }
    if (this.chartType === 'bar') {
    } else {
      const item = this._getItemByIndex(this.detailData.head, index);
      if (item && item.id) {
        queryParams.dicItems = [item.id];
      }
    }
    this.goToPage('用户列表', '/scene-insight/advanced-trans-funnel/users', {
      queryParams: JSON.stringify(queryParams),
      pageSource: 'behavior-analysis'
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.detailData) {
      if (changes.detailData.currentValue && changes.detailData.currentValue.head) {
        if (changes.detailData.currentValue.head.length > 5) {
          this.scroll = changes.detailData.currentValue.head.length * 160 + 'px';
        } else {
          this.scroll = '1000px';
        }
      }
    }
    if (changes.chartType && changes.chartType.currentValue) {
      this._current = 1;
      this._pageSize = 10;
    }
  }
}
