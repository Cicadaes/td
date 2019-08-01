import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActionsTableService } from './actions-table.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../@themes/scroll-service';

@Component({
  selector: 'actions-table',
  templateUrl: './actions-table.component.html',
  styleUrls: ['./actions-table.component.css']
})

export class ActionsTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  isShowAddActionModal = false;
  currentAction: any;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;

  constructor(private scrollSer: ScrollToTopService, private service: ActionsTableService, private confirmServ: NzModalService) {

  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  showAddActionModal(action: any) {
    this.currentAction = action;
    this.isShowAddActionModal = true;
  }

  hideAddActionModal(params: any) {
    this.isShowAddActionModal = false;
  }

  deleteActionModal(params: any) {
    const _this = this;
    const title = '您确定要删除功能 “' + params.name + '”吗？';
    this.confirmServ.confirm({
      nzTitle: title,
      nzContent: '',
      // title: '提示',
      // content: title,
      nzOnOk: () => {
        _this.service.deleteAction(params).subscribe((data: any) => {
          _this.reset();
        });
      },
      nzOnCancel: () => { }
    });
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this.queryParams.page = this._current;
    this.queryParams.rows = this._pageSize;
    this.service.getActions(this.queryParams).subscribe((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.list;
      this.scrollSer.scrollToTop();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.queryParams = changes.queryParams.currentValue || {};
    this.reset();
  }

  ngOnInit() {
  }
}
