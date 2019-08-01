import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { permissionsService } from '../../../permissions/permissions.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../../@themes/scroll-service';


@Component({
    selector: 'user-auth-table',
    templateUrl: './user-auth-table.component.html',
    styleUrls: ['./user-auth-table.component.css']
})

export class UserAuthTableComponent implements OnInit, OnDestroy, OnChanges {
    @Input() queryParams: any;
    @Input() batchRemove = false;
    @Input() isSuper = true;
    @Input() isReloadData = false;
    @Input() tenantId: number;
    @Input() targetId: number;
    @Output() canShow = new EventEmitter<Boolean>();

    isShowAddUserAuthModal = false;
    currentUserAuth: any;
    _allChecked: boolean;
    _targetCode: string;
    _setCode: any;

    _dataSet: any = [];
    _loading = false;
    _sortValue: any = null;
    _checkAll = (isCheckAll: any) => {
        this._dataSet.forEach((ug: any) => ug.hasAuth = isCheckAll);
        this._allChecked = isCheckAll;
        this._refreshStatus();
    }

    /**
     * 是否允许弹窗
     * @param  {any}    e [description]
     * @return {[type]}   [description]
     */
    checkData(e: any = null) {
        this._refreshStatus();
        for (const item of this._dataSet) {
            if (item.hasAuth) {
                this.canShow.emit(true);
                return;
            }
        }
        this.canShow.emit(false);
    }

    constructor(private scrollSer: ScrollToTopService, private service: permissionsService, private confirmServ: NzModalService) {

    }

    sort(value: any) {
        this._sortValue = value;
        this.refreshData();
    }

    reset() {
        this.refreshData(true);
    }
    editSubmit() {
        // console.log('this.dataSet',this._dataSet);
        const params: any = {};
        params.targetCode = this._targetCode;
        params.targetId = this.targetId;
        params.tenantId = this.tenantId;
        params.id = this._setCode;
        params.authBeans = this._dataSet;
        this.service.editDefaultAuth(params).then((data: any) => {
            if (data['code'] === 200) {
                this.confirmServ.warning({
                    nzTitle: '保存成功',
                    nzOnCancel() {
                    }
                });
            } else {
                this.confirmServ.warning({
                    nzTitle: '保存失败',
                    nzOnCancel() {
                    }
                });
                this.reset();
            }


        });

    }
    refreshData(reset = false) {
        this._loading = true;
        let param = {
            tenantId: this.tenantId,
            targetId: this.targetId,
        }
        this.service.getPermissionByTargetId(param).then((data: any) => {
            if (data['code'] === 200) {
                // const temp = data.data.authBeans;
                // temp.forEach((item: any) => {
                //     item.checked = item.hasAuth;
                // });
                this._targetCode = data.data.targetCode;
                this._setCode = data.data.id;
                this._dataSet = data.data.authBeans;
                this.scrollSer.scrollToTop();
            }
            this._loading = false;
            this.isReloadData = false;

            this.checkData();

        });
    }
    batchRevokeUser(arr: any) {

    }
    ngOnChanges(changes: SimpleChanges) {
        for (const key in changes) {
            if (key === 'queryParams' && changes.queryParams.currentValue != null) {
                this.queryParams = changes.queryParams.currentValue || {};
                this.reset();
            } else if (key === 'isReloadData' && changes.isReloadData.currentValue != null) {
                this.isReloadData = changes.isReloadData.currentValue || false;
                if (this.isReloadData === true) {
                    this.reset();
                }
            } else if (key === 'batchRemove' && changes.batchRemove.currentValue != null) {
                this.batchRemove = changes.batchRemove.currentValue || false;
                if (this.batchRemove === true) {
                    const checkAuthSet: any[] = [];
                    this._dataSet.forEach((userAuth: any, index: any) => {
                        if (userAuth.checked) {
                            checkAuthSet.push(userAuth.id);
                        }
                    });
                    if (checkAuthSet.length > 0) {
                        this.batchRevokeUser(checkAuthSet);

                    }

                }
            }
        }
    }

    /**
     * 删除用户
     * @return {[type]} [description]
     */
    deleteUser(data: any) {
        this.confirmServ.confirm({
            nzTitle: '您确认要移除用户\'' + data.name + '\'吗？',
            nzContent: '<strong></strong>',
            nzOnOk: () => {
                const checkAuthSet: any = [data.id];
                this.batchRevokeUser(checkAuthSet);

            }
        });
    }


    ngOnInit() {
        this.reset();
    }

    ngOnDestroy() {
        this.isReloadData = false;
    }


    _refreshStatus() {
        const allChecked = this._dataSet.every((value: any) => value.hasAuth === true);
        const allUnChecked = this._dataSet.every((value: any) => !value.hasAuth);
        this._allChecked = (this._dataSet && this._dataSet.length) ? allChecked : false;
    }

}
