import { Component, OnInit, Input, OnChanges, SimpleChanges, Injector } from '@angular/core';
import { AdvancedTransFunnelService } from '../../advanced-trans-funnel.service';
import { Globals } from '../../../../utils/globals';
import { BaseComponent } from '../../../../common/base-component';

@Component({
  selector: 'app-advanced-trans-funnel-users-page',
  templateUrl: './advanced-trans-funnel-users-page.component.html',
  styleUrls: ['./advanced-trans-funnel-users-page.component.less']
})
export class AdvancedTransFunnelUsersPageComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() dateRange: any;
  _queryParams: any;
  _dateRange: any[];

  _tableHead: any[] = [];
  _table: any;
  _isShowSelectTableColoumnModal: boolean;
  _isShowUserExportModal: boolean;
  _isShowUserExportSuccessModal: boolean;
  _isShowUserSaveModal: boolean;
  _isReloadTable: boolean;
  _userTotal: any;
  _pageSource: any;
  _sdkSource: any;

  containerStyle: any;

  constructor(private service: AdvancedTransFunnelService, public globals: Globals, private injector: Injector) {
    super(injector);
    const _queryParamsStr = this.route.snapshot.params['queryParams'];
    this._pageSource = this.route.snapshot.params['pageSource'];
    this._sdkSource = this.route.snapshot.params['sdkSource'] || '';
    if (_queryParamsStr) {
      this._queryParams = JSON.parse(_queryParamsStr);
      this._dateRange = [];
      const _dateRangeStr = this._queryParams.dateRange;
      if (_dateRangeStr && _dateRangeStr.indexOf('~') !== -1) {
        const _dateRangeAttr = _dateRangeStr.split('~');
        const startTimeFormat = this.globals.dateFormat1(_dateRangeAttr[0], '/');
        const endTimeFormat = this.globals.dateFormat1(_dateRangeAttr[1], '/');
        const startTime = new Date(startTimeFormat);
        const endTime = new Date(endTimeFormat);
        this._dateRange.push(startTime);
        this._dateRange.push(endTime);
      }
    }
  }

  onBackUserTableData(data: any) {
    this._userTotal = data;
  }

  showUserSaveDialog() {
    this._isShowUserSaveModal = true;
  }

  hideUserSaveModal(data: any) {
    this._isShowUserSaveModal = false;
  }

  onSubmitUserSave(data: any) {
    console.dir([data]);
  }

  showUserExportDialog() {
    this._isShowUserExportModal = true;
  }

  hideUserExportModal(data: any) {
    this._isShowUserExportModal = false;
  }

  hideUserExportSuccessModal(data: any) {
    this._isShowUserExportSuccessModal = false;
  }

  onSubmitUserExport(data: any) {
    console.dir([data]);
    this._export(data);
  }

  _getDataIds(data: any[]) {
    const ids = [];
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].id);
      }
    }
    return ids;
  }

  _export(data: any) {
    if (data.length === 0) {
      return false;
    }
    let params;
    let _sdkSource = this._sdkSource || '';
    if (_sdkSource === 'undefined') {
      _sdkSource = '';
    }
    if (this._pageSource === 'behavior-analysis') {
      // 事件分析
      const dateRangeStr = `${this.globals.dateFormat1(this._queryParams.startDate, '-')}至${this.globals.dateFormat1(
        this._queryParams.endDate,
        '-'
      )}`;
      params = {
        productId: this.globals.getProductIdByStorage(),
        type: 'behaviorCrowd',
        title: `行为分析-事件分析-用户列表-数据导出-${dateRangeStr}`,
        param: {
          behavior: this._queryParams,
          titles: this._getDataIds(data)
        }
      };
    } else if (this._pageSource === 'advanced-trans-funnel') {
      // 高级转化漏斗
      const dateRangeStr = `${this.globals.dateFormat(this._dateRange[0], '')}至${this.globals.dateFormat(
        this._dateRange[1],
        ''
      )}`;
      params = {
        productId: this.globals.getProductIdByStorage(),
        type: 'conversionFunnelCrow',
        title: `场景洞察-${_sdkSource}高级转化漏斗-用户列表-数据导出-${dateRangeStr}`,
        param: {
          funnel: this._queryParams,
          titles: this._getDataIds(data)
        }
      };
    }
    this.service.exportCrowd(params).subscribe((response: any) => {
      if (response && response.success) {
        //                this.message.create('success', response.msg);
        this._isShowUserExportSuccessModal = true;
      }
    });
  }

  showSelectTableColoumnDialog() {
    this._isReloadTable = false;
    this._isShowSelectTableColoumnModal = true;
  }

  hideSelectTableColoumnModal(data: any) {
    this._isShowSelectTableColoumnModal = false;
  }

  onSubmitSelectTableColoumn(data: any) {
    this._tableHead = data;
    this._isReloadTable = true;
    this.queryTableDatas();
  }

  queryTableDatas() {
    if (this._queryParams) {
      this.resetTable();
    }
  }

  resetTable() {
    this._table = {
      head: this._tableHead,
      params: this._queryParams,
      reload: this._isReloadTable
    };
  }

  ngOnInit() {
    this.globals.resetBodyStyle();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dateRange && changes.dateRange.currentValue) {
      this._dateRange = changes.dateRange.currentValue;
    }
    if (changes.queryParams && changes.queryParams.currentValue) {
      this._queryParams = changes.queryParams.currentValue;
      //            this.queryTableDatas();
    }
  }
}
