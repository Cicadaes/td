import { Component, Injector, OnInit, OnChanges, ViewChild } from '@angular/core';
import { BaseComponent } from '../common/base-component';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { DataSearchService } from './data-search.service';

@Component({
  selector: 'app-data-search',
  templateUrl: './data-search.component.html',
  styleUrls: ['./data-search.component.less'],
  providers: [DataSearchService]
})
export class DataSearchComponent extends BaseComponent implements OnInit, OnChanges {
  @ViewChild('myInput') input;

  tableList: any = []; // 左侧菜单列表
  tableIndex: number;
  tableKeyword: string;
  _newtableName: string;
  _currentTable: any;
  _tableTitle: any;
  _isShowNewtable: boolean;
  _isShowTableStructureDialog: boolean;
  containerStyle: any; // 根据页面高度渲染左边的菜单
  _appConfig: any;
  _tenantAdmin: boolean;
  checked: boolean;
  _sqlTabs: any[] = [
    {
      value: 'result',
      label: '查询结果'
    },
    {
      value: 'history',
      label: '查询历史'
    }
  ];
  _selectedTabIndex: any = 0;
  _selectSql: any;

  _isShowGenerateApiDialog: boolean;
  _currentProduct: any;
  searchValue: any;

  nodes = [
    new NzTreeNode({
      title: 'customer',
      key: '1001',
      expanded: true,
      children: [
        {
          title: 'name',
          key: '10001',
          isLeaf: true
        },
        {
          title: 'IDCard',
          key: '10002',
          isLeaf: true
        },
        {
          title: 'viplevel',
          key: '10003',
          isLeaf: true
        },
        {
          title: 'accountId',
          key: '10004',
          isLeaf: true
        },
        {
          title: 'productId',
          key: '10005',
          isLeaf: true
        },
        {
          title: 'accountType',
          key: '10006',
          isLeaf: true
        },
        {
          title: 'updateTime',
          key: '10007',
          isLeaf: true
        }
      ]
    })
  ];

  nzEvent(event: NzFormatEmitEvent): void {
    // console.log(event);
  }
  constructor(private service: DataSearchService, private injector: Injector) {
    super(injector);
  }

  onSelectSql() {
    this._selectedTabIndex = 0;
  }

  showTableStructureDialog(title: any) {
    this._isShowTableStructureDialog = true;
    this._tableTitle = title;
  }

  hideTableStructureDialog() {
    this._isShowTableStructureDialog = false;
  }

  showGenerateApiDialog(data?: any) {
    this._isShowGenerateApiDialog = true;
    this._currentProduct = data;
  }

  hideGenerateApiDialog(value: boolean) {
    this._isShowGenerateApiDialog = false;
    this._currentProduct = null;
  }

  onSubmitGenerateApi(value: boolean) {}

  _selectedTabIndexChange(index: any) {
    this._selectedTabIndex = index;
  }

  downloadData() {
    /*const that = this;
        const json = that._queryAllParams.json;
        const data = {
            productId: that.productId,
            type: 'behavior',
            title: `基础分析-行为分析-明细数据-数据导出-${dateRangeStr}`,
            param: json
        };
        that.behaviorAnalysisService.download(data).subscribe(() => {
        });*/
  }

  goPage(hash: string) {
    this.commonService.goPage(hash);
  }

  /*queryAppConfig() {
        this.service.getAppConfig().subscribe((response: any) => {
            this._appConfig = response || {};
            if (this._appConfig && this._appConfig.user && this._appConfig.user.tenantAdmin) {
                this._tenantAdmin = this._appConfig.user.tenantAdmin;
            }
        });
    }*/

  _setInputFocus() {
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 100);
  }

  resetInputValue() {
    this._newtableName = '';
    this._isShowNewtable = false;
    //                this.tableKeyword = '';
  }

  _onSearchTagCate(value: any) {
    this.tableKeyword = value || '';
    this.querytableList(false);
  }

  checktable(item: any, index: number) {
    this._currentTable = item;
    this.tableIndex = index;
  }

  querytableList(init: boolean) {
    const params = {
      productId: this.productId,
      name: this.tableKeyword
    };
    /*this.service.queryTagCategories(params).subscribe((response: any) => {
            if (response && response.code === 200) {
                this.tableList = response.data.data;
                if (init && this.tableList && this.tableList.length > 0) {
                    const table = this.globals.getStorageLocal('user-configured-tag-category');
                    if (table && this.productId === table.productId) {
                        this._currentTable = table;
                        this._changeTableIndex();
                    } else {
                        this._currentTable = this.tableList[0];
                        this.tableIndex = 0;
                        this.storageLocaltable();
                    }
                } else {
                    this.tableIndex = null;
                    if(this._currentTable){
                        for(let i=0;i<this.tableList.length;i++){
                            if(this._currentTable.id === this.tableList[i].id){
                                this.checktable(this.tableList[i],i)
                                this._changeTableIndex();
                                break;
                            }
                        }
                    }
                }
            }
        });*/
  }

  _changeTableIndex() {
    if (this._currentTable && this.tableList && this.tableList.length > 0) {
      for (let i = 0; i < this.tableList.length; i++) {
        if (this._currentTable.id === this.tableList[i].id) {
          this.tableIndex = i;
          break;
        }
      }
    }
  }

  _onLoadTagCate(value: any) {
    if (value) {
      this.querytableList(false);
    }
  }

  ngOnInit() {
    /*this.queryAppConfig();*/
    // this.querytableList(true);
    this.calContainerStyle();
  }

  calContainerStyle(): void {
    this.containerStyle = {
      height: window.innerHeight - 85 - 32 - 49 - 110 + 'px'
    };
  }
}
