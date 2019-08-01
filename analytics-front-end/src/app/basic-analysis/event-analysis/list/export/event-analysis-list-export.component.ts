import { Component, Injector, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { EventAnalysisService } from '../../event-analysis.service';
import { BaseComponent } from '../../../../common/base-component';
import { Globals } from '../../../../utils/globals';
import { format } from 'date-fns';

@Component({
  selector: 'app-event-analysis-list-export',
  templateUrl: './event-analysis-list-export.component.html',
  styleUrls: ['./event-analysis-list-export.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisListExportComponent extends BaseComponent implements OnInit {
  @Input() isVisible: Boolean;
  @Input() params: Boolean;
  @Output() onHide = new EventEmitter<any>();
  @Output() onSubmit = new EventEmitter<any>();
  exportParams: any = {};
  sourceList: any = [{ value: '导出事件列表', key: 'all' }, { value: '自定义导出', key: 'event' }];
  _isConfirmLoading: Boolean = false;
  loading: Boolean = false;
  _isVisible: Boolean = false;
  _loadingMore: Boolean = false;
  modelWidth: any = 400;
  allChecked = false;
  indeterminate = false;
  eventDataList: any = [];
  pageIndex: any = 1;
  keyword: any = '';
  selectedList: any = [];

  constructor(public service: EventAnalysisService, private injector: Injector, private golbals: Globals) {
    super(injector);
  }

  ngOnInit() {}

  trim(str: string) {
    if (str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    } else {
      return '';
    }
  }

  handleOk(): void {
    if (!this.exportParams.name) {
      this.message.create('error', '请输入报表名称');
      return;
    }
    if (this.exportParams.exportScope == 'event' && this.selectedList.length == 0) {
      this.message.create('error', '请选择要导出的事件');
      return;
    }
    this.exportParams['eventIds'] = [];
    for (let i = 0; i < this.selectedList.length; i++) {
      if (this.selectedList[i].checked) {
        this.exportParams['eventIds'].push(this.selectedList[i].event);
      }
    }
    this._isConfirmLoading = true;
    const params = {
      productId: this.productId,
      type: 'eventOverview',
      title: this.trim(this.exportParams.name),
      param: {
        productId: this.productId,
        startDate: this.golbals.dateFormatNumber(this.exportParams.startDate, ''),
        endDate: this.golbals.dateFormatNumber(this.exportParams.endDate, ''),
        label: this.exportParams.label == '1' ? true : false,
        eventType: this.exportParams.eventType,
        sdkSource: this.exportParams.sdkSource,
        platform: this.exportParams.platform,
        exportScope: this.exportParams.exportScope,
        sort: this.exportParams.exportScope == 'event' ? null : this.exportParams.sort,
        order: this.exportParams.exportScope == 'event' ? null : this.exportParams.order,
        eventName: this.keyword || this.exportParams.eventName,
        eventIds: this.exportParams.eventIds
      }
    };
    this.service.export(params).subscribe((response: any) => {
      this._isConfirmLoading = false;
      if (response && response.success) {
        this.onSubmit.emit(true);
      } else {
        this.message.create('error', response.msg);
      }
    });
  }

  handleCancel(): void {
    this._isVisible = false;
    this.golbals.resetBodyStyle();
    this.onHide.emit(this._isVisible);
  }

  refreshStatus(index?: any): void {
    if (this.selectedList.length >= 1000 && this.eventDataList[index].checked) {
      this.eventDataList[index].checked = false;
      this.message.create('error', '最多选择1000个');
      return;
    }
    const list = this.eventDataList;
    const allChecked = list.filter((value: any) => !value.disabled).every((value: any) => value.checked === true);
    const allUnChecked = list.filter((value: any) => !value.disabled).every((value: any) => !value.checked);
    if (list[index]) {
      if (list[index].checked) {
        if (this.selectedList.findIndex((value: any) => value.event == list[index].event) < 0) {
          this.selectedList.push(list[index]);
        }
      } else {
        this.selectedList = this.selectedList.filter((value: any) => value.event != list[index].event);
      }
      if (this.selectedList.length >= 1000) {
        list.filter((value: any) => (value.disabled = value.checked ? false : true));
      } else {
        list.filter((value: any) => (value.disabled = false));
      }
    }

    setTimeout(() => {
      this.allChecked = list.length == 0 || this.selectedList.length == 0 ? false : allChecked;
    }, 1000);
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    let i = 0;
    this.eventDataList.forEach((data: any, index: any) => {
      if (!data.disabled) {
        if (value) {
          if (i < 1000) {
            i++;
          } else {
            this.message.create('error', '最多选择1000个');
            return;
          }
        }
        data.checked = value;
        this.refreshStatus(index);
      }
    });
  }

  eventChange(value: any) {
    this.modelWidth = value == 'event' ? 650 : 400;
    if (value == 'event') {
      this.exportParams.label = '0';
      this.allChecked = false;
      this.indeterminate = false;
      this.searchData(true);
    } else {
      this.keyword = '';
      this.selectedList = [];
      this.eventDataList = [];
    }
  }

  delete(data: any, index: any) {
    for (let i = 0; i < this.eventDataList.length; i++) {
      if (this.eventDataList[i].event == data.event) {
        this.eventDataList[i].checked = false;
      }
    }
    this.selectedList.splice(index, 1);
    this.allChecked = false;
    this.refreshStatus(index);
  }

  deleteAll() {
    this.selectedList = [];
    this.eventDataList.forEach(element => {
      element.checked = false;
      element.disabled = false;
    });
    this.refreshStatus();
    this.indeterminate = false;
    this.allChecked = false;
  }

  _onSearch(value: any) {
    this.keyword = value || '';
    this.searchData(true);
  }
  loadingMore() {
    ++this.pageIndex;
    this._loadingMore = true;
    this.searchData(false, true);
  }

  searchData(search: boolean = false, more?: boolean): void {
    if (search) {
      this.pageIndex = 1;
    }
    this.loading = true;
    const param = {
      page: this.pageIndex,
      rows: 9999,
      startDate: this.golbals.dateFormatNumber(this.exportParams.startDate, ''),
      endDate: this.golbals.dateFormatNumber(this.exportParams.endDate, ''),
      productId: this.productId,
      eventType: this.exportParams.eventType,
      sdkSource: this.exportParams.sdkSource,
      platform: this.exportParams.platform,
      sort: this.exportParams.sort,
      order: this.exportParams.order,
      eventName: this.keyword
    };

    this.service.exportEventList(param).subscribe((response: any) => {
      this.loading = false;
      this._loadingMore = false;
      if (response && response.data) {
        if (more) {
          this.eventDataList = [...response.data.rows];
        } else {
          this.eventDataList = response.data.rows;
          this.selectedList.forEach((element: any) => {
            const selected = this.eventDataList.find((item: any) => item.event == element.event);
            if (selected) {
              selected['checked'] = true;
            }
          });
          this.refreshStatus();
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isVisible) {
      this._isVisible = changes.isVisible.currentValue;
    }
    if (changes.params) {
      this.exportParams = this.deepCopy(changes.params.currentValue);
      this.exportParams.startDate = format(this.exportParams.startDate, 'YYYY-MM-DD');
      this.exportParams.endDate = format(this.exportParams.endDate, 'YYYY-MM-DD');
      this.exportParams.exportScope = 'all';
    }
  }
}
