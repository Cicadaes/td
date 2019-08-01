import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UserGroupAuthTableService } from './user-group-auth-table.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../@themes/scroll-service';

@Component({
    selector: 'user-group-auth-table',
    templateUrl: './user-group-auth-table.component.html',
    styleUrls: ['./user-group-auth-table.component.css']
})

export class UserGroupAuthTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() reload = false;
    @Input() hasOperCol: string;
    @Input() batchRemove = false;

    @Input() tenantId: any;

    @Output() onChecked = new EventEmitter<any>();

    private _tenantId: any;

    @Input() set _batchRemove(_batchRemove: EventEmitter<any>) {
        _batchRemove && _batchRemove.subscribe((data: boolean) => {
            this.removeBatch();
        })
    }

    // 刷新数据
    // data.type
    // 0----弹出框表格
    // 1----用户组展示表格
    // hasOperCol
    // 'false'----弹出框表格
    // 'true'----用户组展示表格
    @Input() set refresh(_refresh: EventEmitter<any>) {
        _refresh && _refresh.subscribe && _refresh.subscribe((data: any) => {
            if (data.type && this.hasOperCol === 'true') {
                this.getUserGroupD(true);
            } else if (!data.type && this.hasOperCol === 'false') {
                this.getUserNotC(true);
            }
        })
    }

    private refreshType = 0;

    @Input() doBatchRevoke: boolean;
    @Output() onCheckUserGroup = new EventEmitter<any[]>();
    _allChecked: boolean;
    roleId: number;
    isShowAddUserGroupAuthModal = false;
    currentUserGroupAuth: any;

    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    _sortValue: any = null;

    _indeterminate = false;
    _checkList: any = [];
    constructor(private scrollSer: ScrollToTopService, private fb: FormBuilder, private service: UserGroupAuthTableService, private confirmServ: NzModalService, private activatedRoute: ActivatedRoute, private router: Router) {
        this._tenantId = this.activatedRoute.snapshot.params.tenantId;
    }

    sort(value: any) {
        this._sortValue = value;
        this.refreshData();
    }

    reset() {
        this.refreshData(true);
    }

    showAddUserGroupAuthModal(userGroupAuth: any) {
        this.currentUserGroupAuth = userGroupAuth;
        this.isShowAddUserGroupAuthModal = true;
    }

    hideAddUserGroupAuthModal(params: any) {
        this.isShowAddUserGroupAuthModal = false;
    }



    deleteUserGroupModal(params: any) {
        const _thisd = this;
        const title = '您确定要移除用户组\'' + params.name + '\'吗？';
        this.confirmServ.confirm({
            nzTitle: title,
            nzContent: '',
            nzOnOk: () => {
                _thisd.service.deleteUserGroupRoleREL(params).subscribe((data: any) => {
                    _thisd.reset();
                });
            },
            nzOnCancel() { }
        });
    }

    refreshData(reset = false) {
        this.scrollSer.scrollToTop();
        // let params = this.getParam(reset)

        if (this.hasOperCol === 'true') {
            this.getUserGroupD(reset);
        } else {
            this.getUserNotC(reset);

        }
        this._allChecked = false;
        this._indeterminate = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.queryParams) {
            this.queryParams = changes.queryParams.currentValue || {};
        } else {
            this.queryParams = {};
        }
        if (changes.reload) {
            this.reload = changes.reload.currentValue || false;
        } else {
            this.reload = false;
        }

        if (this.reload) {
          this.refreshData();
        } else {
          this.reset();
        }

    }


    _refreshStatus() {
        this.onChecked.emit(this._dataSet);
        const allChecked = this._dataSet.every((value: any) => value.checked === true);
        const allUnChecked = this._dataSet.every((value: any) => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
        this.callbackSelect();
    }

    callbackSelect() {
        this._checkList = [];
        this._dataSet.forEach((user: any, index: any) => {
            if (user.checked) {
                this._checkList.push(user);
            }
        });
        this.onCheckUserGroup.emit(this._checkList);
    }

    _checkAll(value: boolean) {
        if (value) {
            this._dataSet.forEach((data: any, index: any) => {
                data.checked = true;
            });
        } else {
            this._dataSet.forEach((data: any, index: any) => {
                data.checked = false;
            });
        }
        this._refreshStatus();
    }

    ngOnInit() {
        this.roleId = this.activatedRoute.snapshot.params['roleId'];
        this.reset();
    }


    /**
     * 批量移除
     * @return {[type]} [description]
     */
    private removeBatch() {
        let checkAuthStr = '';
        this._dataSet.forEach((userAuth: any, index: any) => {
            if (userAuth.checked) {
                checkAuthStr += userAuth.id + ',';
            }
        });
        if (checkAuthStr.length > 0) {

            checkAuthStr = checkAuthStr.substring(0, checkAuthStr.length - 1);
            const params = { ids: checkAuthStr };
            this.service.batchDeletingUserGroupRoleREL(params).subscribe((data: any) => {
                if (data.success === true) {
                    this.reset();
                }
            });
        } else {
            this.reset();
        }
    }

    /**
     * 获取接口参数
     * @return {[type]} [description]
     */
    private getParam(reset = true): any {
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        const params = this.queryParams || {};
        params.id = this.activatedRoute.snapshot.params['roleId'];
        params.page = this._current;
        params.rows = this._pageSize;
        return params;
    }

    /**
     * 获取用户组信息
     * @return {[type]} [description]
     */
    private getUserGroupD(reset = true) {
        const params = this.getParam(reset);
        delete params.virtualroleIdList;
        delete params.roleId;
        params.type = 'USERGROUP';
        this.service.getAuthUserGroup(params).subscribe((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
        });
    }

    /**
     * 获取未被选中的用户组信息
     * @return {[type]} [description]
     */
    private getUserNotC(reset = true) {
        const params = this.getParam(reset);
        delete params.virtualroleIdList;
        delete params.roleId;
        params.tenantId = this._tenantId;
        params.type = 'USERGROUP';
        this.service.getUserGroupList(params).subscribe((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
        });
        this._allChecked = false;
        this._indeterminate = false;
    }
}
