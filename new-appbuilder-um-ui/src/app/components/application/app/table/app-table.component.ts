import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { AppTableService } from './app-table.service';

import { Router } from '@angular/router'

import { ScrollToTopService } from '../../../../@themes/scroll-service'


@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.css']
})

export class AppTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  isShowAddAppModal: boolean = false;
  currentApp: any;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;


  constructor(private scrollSer: ScrollToTopService, private router: Router, private service: AppTableService) {

  }


  reset() {
    this.refreshData(true);
  }

  showAddAppModal(app: any) {
    this.currentApp = app;
    this.isShowAddAppModal = true;
  }
  updateAppStatus(app: any, status: any) {
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
    this.checkParams(params)
    params.page = this._current;
    params.rows = this._pageSize;

    this.service.getApps(params).then((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.list;

      this.scrollSer.scrollToTop()

    }).catch((err: any) => {
      console.log(err);
    });

  }


  ngOnChanges(changes: SimpleChanges) {
    this.queryParams = changes.queryParams.currentValue || {}
    this.reset();
  }

  ngOnInit() {
  }

  /**
   * 检查搜索参数
   * @param  {any}    obj [description]
   * @return {[type]}     [description]
   */
  private checkParams(obj: any) {

  }
}
