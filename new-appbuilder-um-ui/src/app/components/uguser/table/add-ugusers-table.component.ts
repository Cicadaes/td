import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddUgUsersTableService } from './add-ugusers-table.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { NzModalService } from 'ng-cosmos-ui';
@Component({
    selector: 'add-ugusers-table',
    templateUrl: './add-ugusers-table.component.html',
    styleUrls: ['./add-ugusers-table.component.css'],
})

export class AddUgUsersTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() reload = false;
    @Input() refresh = false;
    @Output() onCheck = new EventEmitter<any[]>();
    isShowAddUerModal = false;
    isReloadUserTable = false;

    userGroupId: any;
    userGroup: any;
    currentUser: any;
    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _checkList: any = [];
    _loading = true;
    _sortValue: any = null;
    tenantId: any;
    /*checkbox使用变量*/
    _allChecked = false;
    _indeterminate = false;
    rolecode: any;
    _value: any;

    constructor(
        private scrollSer: ScrollToTopService,
        private service: AddUgUsersTableService,
        private confirmServ: NzModalService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    sort(value: any) {
        this._sortValue = value;
        this.refreshData();
    }

    reset() {
        this.refreshData(true);
    }

    showAddUserModal(user: any) {
        this.router.navigate(['/ugusers/addUgUserPage'], user);
    }

    showUserDetail(user: any) {
        this.router.navigate(['/userGroups/viewUserGroupDetail']);
    }

    deleteUserFromUserGroup(user: any) {
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        this.service.getUserGroupPageDetail(this.userGroupId).then((data1: any) => {
            if (data1.success) {
                this.userGroup = data1.data;
                const _this_ = this;
                this.confirmServ.confirm({
                    nzMaskClosable: false,
                    nzTitle: '确定要移除用户' + user.name + '吗？',
                    nzContent: '',
                    nzOnOk() {
                        _this_.service.deleteUserFromUserGroup(_this_.userGroup, user).then((data: any) => {
                            if (data.success) {
                                const params = {};
                                params['status'] = 1;
                                params['virtualRoleId'] = _this_.userGroup.id;
                                params['id'] = user.id;
                                _this_.service.getUgUsers(params).then((response: any) => {
                                    _this_._loading = false;
                                    _this_._total = response.total;
                                    _this_._dataSet = response.list;
                                });
                            } else {
                                alert(data.result);
                            }
                        });
                    }
                });
            }
        });
    }

    deleteUsersFromUserGroup(userGroup: any, users: any) {
        const _this_ = this;
        let userNames = '';
        users.data.forEach((user: any, index: any) => {
            userNames += user.name + ',';
        });
        userNames = userNames.substring(0, userNames.length - 1);
        let uids = '';
        users.data.forEach((user: any, index: any) => {
            uids += user.id + ',';
        });
        uids = uids.substring(0, uids.length - 1);
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: '确认',
            nzContent: '確定要从' + userGroup.name + '用户组中移除' + userNames + '吗？',
            nzOnOk() {
                _this_.service.deleteUsersFromUserGroup(userGroup, uids).then((data: any) => {
                    if (data.success) {
                        const params = {};
                        params['status'] = 1;
                        _this_.service.getUgUsers(params).then((response: any) => {
                            _this_._loading = false;
                            _this_._total = response.total;
                            _this_._dataSet = response.list;
                        });
                    } else {
                        alert(data.result);
                    }
                });
            }
        });
    }

    onSubmitUserFormData(params: boolean) {
        this.isReloadUserTable = params || false;
        if (this.isReloadUserTable) {
            this.refreshData();
        }
    }

    showRoles(user: any) {
        this.currentUser = user;
        this.isShowAddUerModal = false;
        this.service.queryRoleByUser(user).then((data: any) => {
            let roleNames = '';
            if (data.success && data.data) {
                data.data.forEach((c: any, index: any) => {
                    roleNames += c.name;
                });
            }
            this.confirmServ.info({
                nzTitle: user.name + '被授权的角色',
                nzContent: roleNames
            });
        });

    }

    onSearch(event: any, type: any) {
        let params = {};
        const that = this;
        if (!that.userGroupId) {
            that.userGroupId = that.route.snapshot.params['id'];
            that.tenantId = that.route.snapshot.params['tenantId'];
        }
        if (type === 'click') {
            if (event) {
                params = {
                    page: 1,
                    rows: 10,
                    tenantId: that.tenantId,
                    nameOrEmail: event.trim()
                };
            }
            params['virtualRoleId'] = that.userGroupId;
            params['tenantId'] = that.tenantId;
            that.service.getNoOrgUsers(params).then((data: any) => {
                that._loading = false;
                that._total = data.total;
                that._dataSet = data.list;
            });
        } else {
            if (event.keyCode === 13) {
                if (that._value) {
                    params = {
                        page: 1,
                        rows: 10,
                        tenantId: that.tenantId,
                        nameOrEmail: that._value.trim()
                    };
                }
                params['virtualRoleId'] = that.userGroupId;
                params['tenantId'] = that.tenantId;
                that.service.getNoOrgUsers(params).then((data: any) => {
                    that._loading = false;
                    that._total = data.total;
                    that._dataSet = data.list;
                });
            }
        }
    }

    hideAddUserModal(params: any) {
        this.isShowAddUerModal = false;
    }

    refreshData(reset = false) {
        this.scrollSer.scrollToTop();
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        const params = this.queryParams || {};
        params.page = this._current;
        params.rows = this._pageSize;
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
            this.tenantId = this.route.snapshot.params['tenantId'];
        }
        // this.tenantId =this.route.snapshot.params['tenantId'];
        if (this.rolecode === 'UM_TENANT_ADMIN') {
            params.tenantId = window['appConfig'].tenant.id;
        } else {
            params.tenantId = this.route.snapshot.params['tenantId'];
        }
        params.virtualRoleId = this.userGroupId;
        // params.unVirtualRoleId = this.userGroupId;
        params.tenantId = this.tenantId;
        this.service.getNoOrgUsers(params).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
        });

        /*this.service.getTableDatas(this._current, this._pageSize, 'name', this._sortValue,this.queryParams).subscribe((data: any) => {
            this._loading = false;
            this._total = 200;
            this._dataSet = data.results;
        })*/
    }

    _refreshStatus() {
        const allChecked = this._dataSet.every((value: any) => value.checked === true);
        const allUnChecked = this._dataSet.every((value: any) => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
        this.refresh = false;
        this.callbackSelect();
    }

    callbackSelect() {
        this._checkList = [];
        this._dataSet.forEach((user: any, index: any) => {
            if (user.checked) {
                this._checkList.push(user);
            }
        });
        this.onCheck.emit(this._checkList);
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

        if (this.refresh) {
            this._checkAll(false);
            this._allChecked = false;
        }

    }

    ngOnInit() {
        this.userGroupId = this.route.snapshot.params['id'];
        this.rolecode = window['appConfig'].rolecode;
    }
}
