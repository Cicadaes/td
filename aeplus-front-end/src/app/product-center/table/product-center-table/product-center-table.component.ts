import {Component, SimpleChanges, Injector, OnInit, OnChanges} from '@angular/core';
import {NzModalRef} from 'ng-cosmos-ui';
import {ProductCenterService} from '../../product-center.service';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-product-center-table',
    templateUrl: './product-center-table.component.html',
    styleUrls: ['./product-center-table.component.less'],
    providers: [ProductCenterService],
})
export class ProductCenterTableComponent extends BaseComponent implements OnInit, OnChanges {
    confirmModal: NzModalRef;
    pageIndex = 1;
    pageSize = 10;
    total = 1;
    dataSet = [];
    loading = true;
    sortValue = null;
    sortKey = null;

    _isShowProductAddDialog: boolean;
    _currentProduct: any;

    searchGenderList: string[] = [];
    _queryParam: any = {};
    removeFlag = false;             // 删除弹框
    itemObj: any;
    _item: any;
    _appConfig: any = {};
    _loginUserName: string;

    isVisible = false; // 弹框显示变量
    dialogType: string; // 弹窗类型

    dialogName: any; // 弹框名称
    dialogWidth: any; // 弹框宽度

    sort(sort: {key: string, value: string}): void {
        this.sortKey = sort.key;
        this.sortValue = sort.value;
        this.searchData();
    }

    constructor(private service: ProductCenterService,
                private injector: Injector) {
        super(injector);
    }

    deleteProduct(data: any) {
        this._item = data;
//        this.removeFlag = true;
//        this.itemObj = {
//            type: 'delete',
//            message: `确定要删除产品“` + data.productname + `”?`
//        };

        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: `确定要删除产品"${data.productname}"？`,
            nzOnOk: () => {
                this.deleteFunc();
            }
        });
    }

    deleteFunc() {
        this.service.deleteProduct(this._item).subscribe((response: any) => {
            if (response) {
                this.searchData(true);
            }
        });
    }

    // 确定删除 todo -delete
    confirmHideDialog(type: any) {
        this.removeFlag = type;
        this.deleteFunc();

    }

    // 取消删除
    hideItemDialog(type: any) {
        this.removeFlag = type;
    }

    showProductAddDialog(data?: any) {
        this._isShowProductAddDialog = true;
        this._currentProduct = data;
    }

    hideProductAddDialog(value: boolean) {
        this._isShowProductAddDialog = false;
        this._currentProduct = null;
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
        this.service.getProducts(param).subscribe((response: any) => {
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

    showProductShareDialog(data?: any) {
        this._storageProduct(data);
        this.dialogName = '产品授权';
        this.dialogWidth = '819px'; // 保真图的宽度
        this.isVisible = true;
        this.dialogType = 'shareProduct';
        this._currentProduct = data;
    }

    _storageProduct(data: any) {
        if (data && data.id) {
            localStorage.setItem('productId', data.id);
        }
        if (data && data.appkey) {
            localStorage.setItem('appkey', data.appkey);
        }
    }

    viewProduct(data: any) {
        this._storageProduct(data);
        if (window.parent) {
            const response = {
                eventType: 'save',
                eventInfo: {
                    sourceType: 'product',
                    data: {
                        product: data
                    }
                }
            };
            window.parent.postMessage(JSON.stringify(response), '*');
        }
    }

    queryAppConfig() {
        this.service.getAppConfig().subscribe((response: any) => {
            this._appConfig = response || {};
            if (this._appConfig && this._appConfig.user && this._appConfig.user.email) {
                this._loginUserName = this._appConfig.user.email;
            }
        });
    }

    handleCancel(): void {
        this.isVisible = false;
        this.globals.resetBodyStyle();
    }

    cancelModal(value: any) {
        this.isVisible = false;
        this.globals.resetBodyStyle();
    }

    setCookie() {
//      this.globals.setCookie_log('ttt1', 'aaaa1' , '1.td.aeplus.com');
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    ngOnInit(): void {
        this.queryAppConfig();
        this.searchData();
    }

}
