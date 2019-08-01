import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LicencesTableService } from './licences-table.service';
import { ScrollToTopService } from '../../../@themes/scroll-service'

@Component({
  selector: 'licences-table',
  templateUrl: './licences-table.component.html',
  styleUrls: ['./licences-table.component.css']
})

export class LicencesTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  isShowAddAppModal: boolean = false;
  currentApp: any;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;

  constructor(private scrollSer: ScrollToTopService, private service: LicencesTableService) {

  }


  reset() {
    this.refreshData(true);
  }

  showAddAppModal(app: any) {
    this.currentApp = app;
    this.isShowAddAppModal = true;
  }

  hideAddAppModal(params: any) {
    this.isShowAddAppModal = false;
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    let params = this.queryParams || {};
    params.page = this._current;
    params.rows = this._pageSize;

    this.service.getLicences(params).subscribe((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.list;
      this.scrollSer.scrollToTop()
    });

  }


  ngOnChanges(changes: SimpleChanges) {
    this.queryParams = changes.queryParams.currentValue || {};
    this.reset();
  }

  ngOnInit() {
  }
}
