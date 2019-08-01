import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AssociatedLicencesTableService } from './associated-licences-table.service';
import { ScrollToTopService } from '../../../../@themes/scroll-service'

@Component({
  selector: 'associated-licences-table',
  templateUrl: './associated-licences-table.component.html',
  styleUrls: ['./associated-licences-table.component.css']
})

export class AssociatedLicencesTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() appId: any;
  isShowAddAppModal: boolean = false;
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;

  constructor(private scrollSer: ScrollToTopService, private service: AssociatedLicencesTableService) {

  }
  reset() {
    this.refreshData(true);
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    let params = this.queryParams || {};
    params.appId = this.appId;
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
