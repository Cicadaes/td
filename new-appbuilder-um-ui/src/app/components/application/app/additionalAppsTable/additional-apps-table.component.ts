import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AdditionalAppsTableService } from './additional-apps-table.service';
import { ScrollToTopService } from '../../../../@themes/scroll-service'

@Component({
  selector: 'additional-apps-table',
  templateUrl: './additional-apps-table.component.html',
  styleUrls: ['./additional-apps-table.component.css']
})

export class AdditionalAppsTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() appId: any;

  // 刷新数据
  @Input() set refresh(_refresh: EventEmitter<any>) {
    _refresh && _refresh.subscribe && _refresh.subscribe((data: any) => {
      this.reset()
    })
  }
  isShowAddAppModal: boolean = false;
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;

  constructor(private scrollSer: ScrollToTopService, private service: AdditionalAppsTableService) {

  }
  reset() {
    this.refreshData(true);
  }

  refreshData(reset = false) {
    this.scrollSer.scrollToTop()
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    let params = this.queryParams || {};
    params.id = this.appId;
    params.page = this._current;
    params.rows = this._pageSize;

    this.service.getLicences(params).subscribe((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.list;
    });

  }


  ngOnChanges(changes: SimpleChanges) {
    this.queryParams = changes && changes.queryParams && changes.queryParams.currentValue || {};
    this.reset();
  }

  ngOnInit() {
  }
}
