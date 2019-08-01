import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TreeTableService } from './tree-table.service';
import { ScrollToTopService } from '../../../@themes/scroll-service'

@Component({
  selector: 'tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.css']
})

export class TreeTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() ajaxUrl: string;
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;

  constructor(private scrollSer: ScrollToTopService, private service: TreeTableService) {

  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
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

    this.service.getTableDatas(this.ajaxUrl, this._current, this._pageSize, 'name', this._sortValue, this.queryParams).subscribe((data: any) => {
      this._loading = false;
      this._total = 200;
      this._dataSet = data.results;
    })
  }


  ngOnChanges(changes: SimpleChanges) {
    this.queryParams = changes.queryParams.currentValue || {};
    this.reset();
  }

  ngOnInit() {
  }
}
