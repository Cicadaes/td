import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ParamMgtService } from '../../param-mgt.service';
import { Globals } from '../../../../../utils/globals';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-param-mgt-table',
  templateUrl: './param-mgt-table.component.html',
  styleUrls: ['./param-mgt-table.component.less'],
  providers: [ParamMgtService]
})
export class ParamMgtTableComponent implements OnInit, OnChanges {
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  dataSet = [];
  loading = true;
  sortValue = null;
  sortKey = null;

  _isShowAddDialog: boolean = false;
  _isShowViewDialog: boolean = false;
  _currentEventAttribute: any;
  _currentData: any;
  _moreSearchFieldArray: any[] = [];
  _queryParam: any = {};
  usedParamList: any = [];
  usedTotal: any = 0;
  tipShow: boolean = false;
  searchData$ = new Subject();

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
  }

  constructor(
    private service: ParamMgtService,
    private modal: NzModalService,
    public globals: Globals,
    public message: NzMessageService
  ) {}

  showParamAddDialog(data: any) {
    this._isShowAddDialog = true;
    this._currentEventAttribute = data;
  }
  showParamViewDialog(data: any) {
    this._isShowViewDialog = true;
    this._currentData = data;
  }

  hideAddDialog(value: boolean) {
    this._isShowAddDialog = false;
    this._currentEventAttribute = null;
  }

  hideViewDialog(value: boolean) {
    this._isShowViewDialog = false;
    this._currentData = null;
  }

  onSubmitAddParam(value: boolean) {
    this.pageIndex = 1;
    this.searchData$.next();
    this.getUsedParam();
  }

  searchData() {
    this.loading = true;
    const param = this._queryParam || {};
    param.productid = this.globals.getProductIdByStorage();
    param.page = this.pageIndex;
    param.rows = this.pageSize;

    return this.service.query(param);
  }

  getUsedParam() {
    const param = {
      productid: this.globals.getProductIdByStorage(),
      page: 1,
      rows: 20,
      status: 0
    };
    this.service.query(param).subscribe((response: any) => {
      if (response) {
        if (response.list) {
          this.usedParamList = response.list;
          this.usedTotal = response.total;
        }
        if (response && response.success === false) {
          this.usedTotal = 0;
          this.usedParamList = [];
          this.message.create('warning', response.msg);
        }
      }
    });
  }

  /**
   * 处理内容
   */
  handlerContent_displayNameEdit(data: any, type: any, power?: any) {
    if (power !== undefined) {
      // 保存
      if (power) {
        this.displayNameUpdate(data, type);
      } else {
        if (type == 'name') {
          delete data._name;
        } else {
          delete data._displayName;
        }
      }
    } else {
      if (type == 'name') {
        data._name = { value: data.name, loading: false };
      } else {
        data._displayName = { value: data.displayname, loading: false };
      }
    }
  }

  displayNameUpdate(data: any, type: any) {
    const param = {
      productid: this.globals.getProductIdByStorage(),
      id: data.id,
      displayname: type == 'name' ? data.displayname : data._displayName.value || '',
      name: type == 'name' ? data._name.value.trim() : data.name
    };
    if (type == 'name') {
      if (!param.name) {
        this.message.create('error', '参数名称不能为空');
        return;
      }
      if (param.name && param.name.length > 26) {
        this.message.create('error', '参数名称最多26个字符');
        return;
      }
      if (!/^[A-Za-z0-9_]+$/.test(param.name)) {
        this.message.create('error', '参数名称只能是字母，数字和下划线');
        return;
      }
      data._name = { loading: true };
    } else {
      data._displayName = { loading: true };
    }
    this.service.update(param).subscribe((response: any) => {
      const _data = {
        success: response.success,
        message: response.msg
      };
      this.getUsedParam();
      if (_data.success) {
        data.displayname = param.displayname;
        data.name = param.name;
        delete data._displayName;
        delete data._name;
      } else {
        data._displayName ? (data._displayName = { loading: false, value: param.displayname }) : false;
        data._name ? (data._name = { loading: false, value: param.name }) : false;
      }
    });
  }
  handlerContent_status(data: any) {
    const that = this;
    if (that.usedTotal > 9 && !data.isStatus) {
      return false;
    }
    data._status = { loading: true };
    if (data.isStatus) {
      that.modal.confirm({
        nzTitle: `提示`,
        nzContent: `停用后将不再对其进行识别统计，后续启用将会出现数据断档，请确认是否要停用该参数?`,
        nzOkText: '确认',
        nzOnOk: () => {
          that.updateStatus(data);
        },
        nzCancelText: '取消',
        nzOnCancel: () => {
          data.status = data.status;
          delete data._status;
        }
      });
    } else {
      that.updateStatus(data);
    }
  }

  updateStatus(data: any) {
    const that = this;
    const param = {
      id: data.id,
      displayname: data.displayname,
      status: data.status == 0 ? 1 : 0
    };
    that.service.update(param).subscribe((response: any) => {
      that.getUsedParam();
      data.status = response.success ? !data.status : data.status;
      data.isStatus = data.status == 0 ? true : false;
      delete data._status;
    });
  }

  onSearchMoreSearch(params: any) {
    this._queryParam = params;
    this.pageIndex = 1;
    this.searchData$.next();
  }

  initMoreSearchFieldArray(): void {
    this._moreSearchFieldArray = [
      {
        fieldName: 'type',
        fieldLabel: '参数类型',
        fieldType: 'select',
        apiData: false,
        initValue: '',
        span: '6',
        selectOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '流量参数'
          },
          {
            value: '0',
            label: '自定义参数'
          }
        ]
      },
      {
        fieldName: 'status',
        fieldLabel: '识别统计状态',
        fieldType: 'select',
        apiData: false,
        initValue: '',
        span: '6',
        selectOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '启用'
          },
          {
            value: '1',
            label: '停用'
          }
        ]
      },
      {
        fieldName: 'name',
        fieldLabel: '参数',
        fieldType: 'input',
        span: '6',
        placeHolder: '请输入参数名称 / 显示名'
      }
    ];
  }

  handleCancel(): void {
    this.globals.resetBodyStyle();
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit(): void {
    this.initMoreSearchFieldArray();
    this.searchData$
      .pipe(
        switchMap(() => {
          return this.searchData();
        })
      )
      .subscribe(response => {
        this.loading = false;
        if (response) {
          if (response['list']) {
            this.total = response['total'];
            response['list'].forEach((element: any) => {
              element.createTime = this.globals.dateFormat(element.createTime, 'seconds');
              element.isStatus = element.status == 0 ? true : false;
            });
            this.dataSet = response['list'];
          }
          if (response && response['success'] === false) {
            this.total = 0;
            this.dataSet = [];
            this.message.create('warning', response['msg']);
          }
        }
      });
    this.searchData$.next();
    this.getUsedParam();
  }
}
