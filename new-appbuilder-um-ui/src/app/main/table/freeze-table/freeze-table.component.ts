import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FreezeTableService } from './freeze-table.service';
import { ScrollToTopService } from '../../../@themes/scroll-service'

@Component({
  selector: 'freeze-table',
  templateUrl: './freeze-table.component.html',
  styleUrls: ['./freeze-table.component.css']
})

export class FreezeTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() ajaxUrl: string;
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;

  constructor(private scrollSer: ScrollToTopService, private service: FreezeTableService) {

  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;

    this.service.getTableDatas(this.ajaxUrl, this._current, this._pageSize, 'name', this._sortValue, this.queryParams).subscribe((data: any) => {
      this._loading = false;
      this._total = 200;
      this._dataSet = data.results;
      this.scrollSer.scrollToTop()
    })
  }


  ngOnChanges(changes: SimpleChanges) {
    this.queryParams = changes.queryParams.currentValue || {};
    this.reset();
  }

  ngOnInit() {
  }
}
