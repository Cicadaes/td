import { Component, Injector, Input, OnInit, SimpleChanges } from '@angular/core';
import { EventAnalysisService } from '../../../event-analysis.service';
import { BaseComponent } from '../../../../../common/base-component';

@Component({
  selector: 'app-event-analysis-tag-table',
  templateUrl: './event-analysis-tag-table.component.html',
  styleUrls: ['./event-analysis-tag-table.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisTagTableComponent extends BaseComponent implements OnInit {
  @Input() queryAllParams: any;
  @Input() isQuery: any;
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  pageSizeOptions: any;
  dataSet = [];
  loading = true;
  sortWay = null;
  sortField = null;
  _queryParam: any = {};
  _isQuery: any;
  constructor(public service: EventAnalysisService, private injector: Injector) {
    super(injector);
    this.pageSizeOptions = this.table_page_size_options;
  }

  sort(sort: { key: string; value: string }): void {
    this.sortField = sort.key;
    this.sortWay = sort.value;
    this.searchData(true);
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    const param = this._queryParam || {};
    param.page = this.pageIndex;
    param.rows = this.pageSize;
    if (this.sortField) {
      param.sort = this.sortField || '';
      let order = this.sortWay || '';
      if (order === 'descend') {
        order = 'desc';
      } else {
        order = 'asc';
      }
      param.order = order;
    }
    this.service.getTags(param).subscribe((response: any) => {
      this.loading = false;
      if (response && response.data) {
        this.total = response.data.total;
        this.dataSet = response.data.list;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryAllParams) {
      this._queryParam = changes.queryAllParams.currentValue;
    }
    if (changes.isQuery) {
      this._isQuery = changes.isQuery.currentValue;
      if (this._isQuery) {
        this.searchData(true);
      }
    }
  }

  ngOnInit() {}
}
