import { Component, SimpleChanges, Injector, OnInit, OnChanges } from '@angular/core';
import { EventAnalysisService } from '../../event-analysis.service';
import { BaseComponent } from '../../../../common/base-component';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-analysis-list-table',
  templateUrl: './event-analysis-list-table.component.html',
  styleUrls: ['./event-analysis-list-table.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisListTableComponent extends BaseComponent implements OnInit, OnChanges {
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  dataSet = [];
  loading = false;
  sortWay = null;
  sortField = null;
  _keyword: any;
  isVisible: boolean = false;
  showModal: boolean = false;
  searchData$ = new Subject();
  exportParam: any;

  _queryParam: any = {};
  _helpPopover: any = {
    width: {
      width: '110px'
    },
    paddingLeft: {
      'padding-left': '110px'
    },
    list: [
      {
        label: '触发次数',
        des: '某个事件的触发次数。'
      },
      {
        label: '触发用户数',
        des: '某个事件的触发用户数。'
      },
      {
        label: '每启动发生数',
        des: '平均每次使用应用期间触发该事件的次数。每启动发生数＝触发次数／启动次数。'
      },
      {
        label: '每活跃用户发生率',
        des: '平均每个活跃用户中触发了该事件的用户的比例。'
      },
      {
        label: '人均次数',
        des: '独立用户触发该事件的平均次数。人均次数=次数/人数。'
      }
    ]
  };

  constructor(private service: EventAnalysisService, private injector: Injector) {
    super(injector);
  }

  _onFilter(filter: any) {
    this._queryParam = filter;

    this._keyword = '';
    this.pageIndex = 1;
    this.searchData$.next();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortField = sort.key;
    this.sortWay = sort.value;
    this.pageIndex = 1;
    this.searchData$.next();
  }

  searchData() {
    const param = {
      page: this.pageIndex,
      rows: this.pageSize,
      startDate: this._queryParam.startDate,
      endDate: this._queryParam.endDate,
      productId: this.productId,
      eventType: this._queryParam.eventTypeId ? this._queryParam.eventTypeId : this._queryParam.eventTypeStr,
      sdkSource: this._queryParam.sdkSource,
      platform: this._queryParam.platform,
      sort: null,
      order: null,
      eventName: this._keyword || null
    };

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
    // if (this.loading) {
    //   return;
    // }
    this.loading = true;
    this.exportParam = param;
    return this.service.getEvents(param);
  }

  _onSearch(value: any) {
    this._keyword = value || '';
    this.pageIndex = 1;
    this.searchData$.next();
  }

  pageSizeChange() {
    this.pageIndex = 1;
    this.searchData$.next();
  }

  view(data: any) {
    const params = {
      startDate: this._queryParam.startDate || '',
      endDate: this._queryParam.endDate || '',
      eventTypeId: this._queryParam.eventTypeId || '',
      platform: this._queryParam.platform || '',
      sdkSource: this._queryParam.sdkSource || '',
      eventId: data.event,
      sdk: this._queryParam.sdk || ''
    };
    localStorage.removeItem('eventFilter');
    this.commonService.goInto({
      name: '事件详情',
      url: '/basic-analysis/event-analysis-detail',
      params: params
    });
  }

  hideExportDialog(value: boolean) {
    this.isVisible = false;
  }
  onSubmitExport(value: any) {
    this.isVisible = false;
    this.showModal = true;
  }

  openExportModel() {
    this.isVisible = true;
  }

  modalHandleOk() {
    this.showModal = false;
  }

  handleCancel(e: any) {
    this.showModal = false;
  }
  goPage(hash: string) {
    this.commonService.goPage(hash);
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {
    this.searchData$
      .pipe(
        switchMap(() => {
          return this.searchData();
        })
      )
      .subscribe(response => {
        this.loading = false;
        if (response && response['data']) {
          this.total = response['data'].total;
          this.dataSet = response['data'].rows;
        }
      });
  }
}
