import { Component, SimpleChanges, Input, Injector } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { AdvancedTransFunnelService } from '../../advanced-trans-funnel.service';
import { BaseComponent } from '../../../../common/base-component';

@Component({
  selector: 'app-advanced-trans-funnel-table',
  templateUrl: './advanced-trans-funnel-table.component.html',
  styleUrls: ['./advanced-trans-funnel-table.component.less']
})
export class AdvancedTransFunnelTableComponent extends BaseComponent {
  @Input() filter: '';
  @Input() isVisitor: boolean;
  confirmModal: NzModalRef;
  pageIndex = 1;
  pageSize = 10;
  total = 1;
  dataSet = [];
  loading = true;
  sortValue = null;
  sortKey = null;
  _name = '';
  _sdkId = '';

  searchGenderList: string[] = [];
  _moreSearchFieldArray: any[] = [];
  _queryParam: any = {};
  removeFlag = false; // 删除弹框
  itemObj: any;
  _item: any;
  urlParams: any;

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData();
  }

  constructor(private service: AdvancedTransFunnelService, private injector: Injector) {
    super(injector);
    this.urlParams = {};
  }

  goToPage(pageName: string, pageUrl: string, params: any) {
    localStorage.removeItem('funnel-view-search');
    if (pageName == '查看漏斗') {
      this.commonService.goInto({
        name: pageName,
        url: pageUrl,
        params: params || {}
      });
    } else {
      params.isVisitor = this.filter ? this.isVisitor : false;
      !params.sdkId ? delete params.sdkId : params.sdkId;
      !params.tag ? delete params.tag : params.tag;
      this.commonService.goInto({
        name: pageName,
        url: pageUrl,
        params: params || {}
      });
    }
  }

  deleteProduct(data: any) {
    this._item = data;
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: `确定要删除漏斗"${data.name}"？`,
      nzOnOk: () => {
        this.deleteFunc();
      }
    });
  }

  deleteFunc() {
    this.service.delete(this._item).subscribe((response: any) => {
      if (response) {
        this.searchData(true);
      }
    });
  }

  // 确定删除 todo -del
  confirmHideDialog(type: any) {
    this.removeFlag = type;
    this.deleteFunc();
  }

  // 取消删除
  hideItemDialog(type: any) {
    this.removeFlag = type;
  }

  onSubmitAddProduct(value: boolean) {
    this.searchData(true);
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    const param = this._queryParam || {};
    param.page = this.pageIndex;
    param.rows = this.pageSize;
    param.productId = this.productId;
    param.sdkId = this._sdkId || null;
    this.service.query(param).subscribe((response: any) => {
      this.loading = false;
      if (response) {
        this.total = response.total;
        this.dataSet = response.list;
      }
    });
  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.searchData(true);
  }

  _onSearch(value: any) {
    this._queryParam.productname = value || '';
    this.searchData(true);
  }

  onSearchMoreSearch(params: any) {
    this._queryParam = params;
    this.searchData(true);
  }

  initMoreSearchFieldArray(): void {
    this._moreSearchFieldArray = [
      {
        fieldName: 'name',
        fieldLabel: '漏斗名称',
        fieldType: 'input'
      },
      {
        fieldName: 'startStepName',
        fieldLabel: '入口行为',
        fieldType: 'input'
      },
      {
        fieldName: 'endStepName',
        fieldLabel: '目标行为',
        fieldType: 'input'
      },
      {
        fieldName: 'stepNum',
        fieldLabel: '步骤数',
        fieldType: 'integer'
      },
      {
        fieldName: 'funnelOrder',
        fieldLabel: '是否有序',
        fieldType: 'select',
        apiData: false,
        initValue: '',
        selectOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '是'
          },
          {
            value: '0',
            label: '否'
          }
        ]
      },
      {
        fieldName: 'status',
        fieldLabel: '计算状态',
        fieldType: 'select',
        apiData: false,
        initValue: '',
        selectOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '未开始'
          },
          {
            value: '2',
            label: '计算中'
          },
          {
            value: '3',
            label: '计算完成'
          },
          {
            value: '-1',
            label: '计算失败'
          }
        ]
      }
    ];
  }

  getSdkId() {
    const that = this;
    const json = {
      sdkName: that.filter,
      productId: that.productId
    };
    that.service.getSdkId(json).subscribe((response: any) => {
      if (response && response.list) {
        that._sdkId = response.list.id;
        that.searchData();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isVisitor && changes.isVisitor.currentValue) {
      this._name = changes.filter
        ? changes.filter.currentValue == 'miniprogram'
          ? '小程序'
          : changes.filter.currentValue
        : '';
      if (!changes.filter) {
        this.searchData();
      } else {
        this.getSdkId();
      }
    } else {
      this.searchData();
    }
  }

  ngOnInit(): void {
    this.initMoreSearchFieldArray();
    // this.getSdkId();
  }
}