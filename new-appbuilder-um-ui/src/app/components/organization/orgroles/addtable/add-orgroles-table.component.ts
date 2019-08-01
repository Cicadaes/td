import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AddOrgRolesTableService } from './add-orgroles-table.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../../../@themes/scroll-service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'add-orgroles-table',
    templateUrl: './add-orgroles-table.component.html',
    styleUrls: ['./add-orgroles-table.component.css']
})

export class AddOrgRolesTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() userId: number;
    isShowRoleModal = false;
    currentRole: any;

    @Input() organization: any;
    /**使用复选框**/
    @Input() refresh = false;
    @Input() reload = false;
    @Output() onCheckAddRole = new EventEmitter<any[]>();
    _allChecked = false;
    _indeterminate = false;
    _checkList: any = [];

    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    _sortValue: any = null;
    userGroupId: any;
    userGroup: any;
    user: any;

    constructor(
        private scrollSer: ScrollToTopService,
        private service: AddOrgRolesTableService,
        private confirmServ: NzModalService,
        private route: ActivatedRoute) {

    }

    sort(value: any) {
        this._sortValue = value;
        this.refreshData();
    }

    reset() {
        this.refreshData(true);
    }

    showRoleModal(role: any) {
        this.currentRole = role;
        this.isShowRoleModal = true;
    }

    hideRoleModal(params: any) {
        this.isShowRoleModal = false;
    }

    refreshData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        this._loading = false;
        this.userGroupId = this.route.snapshot.params['id'];
        const params = {};
        const params1 = this.queryParams || {};
        if (!this.organization) {
            params['page'] = this._current;
            params['rows'] = this._pageSize;
            params1.page = this._current;
            params1.rows = this._pageSize;
        } else {
            params['page'] = this._current;
            params['rows'] = this._pageSize;
            params['virtualRoleId'] = this.organization.id;
            params['tenantId'] = this.organization.tenantId;
            params1.page = this._current;
            params1.rows = this._pageSize;
            params1.virtualRoleId = this.organization.id;
            params1.tenantId = this.organization.tenantId;
        }
        this.service.getAddOrgRoles(params1).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
            this.scrollSer.scrollToTop();
        });

    }

    deleteRoleFromUserGroup(role: any) {
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        this.service.getUserGroupPageDetail(this.userGroupId).then((data: any) => {
            if (data.success) {
                this.userGroup = data.data;
                const _this_ = this;
                this.confirmServ.confirm({
                    nzMaskClosable: false,
                    nzTitle: '确定要移除用户' + role.name + '吗？',
                    nzContent: '',
                    nzOnOk() {
                        _this_.service.deleteRoleFromUserGroup(_this_.userGroup, role).then((data: any) => {
                            if (data.success) {
                                const params = {
                                    virtualRoleId: _this_.userGroupId
                                };
                                _this_.service.getAddOrgRoles(params).then((response: any) => {
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

    deleteRoleFromUser(role: any) {
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        this.service.getUgUserById(this.userGroupId).then((data: any) => {
            if (data.success) {
                this.user = data.data;
                const _this_ = this;
                this.confirmServ.confirm({
                    nzMaskClosable: false,
                    nzTitle: '确定要移除用户' + role.name + '吗？',
                    nzContent: '',
                    nzOnOk() {
                        _this_.service.deleteRolesFromUser(_this_.user, role.id).then((response: any) => {
                            if (!response.success) {
                                alert(response.result);
                            }
                        });
                    }
                });
            }
        });
    }


    /**使用复选框**/
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
        this.onCheckAddRole.emit(this._checkList);
    }
    _checkAll(value) {
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
        this.queryParams = changes.queryParams.currentValue || {};
        this.reset();

        /**使用复选框**/
        if (this.refresh) {
            this._checkAll(false);
            this._allChecked = false;
        }
    }

    ngOnInit() {
        this.userGroupId = this.route.snapshot.params['id'];
    }
}
