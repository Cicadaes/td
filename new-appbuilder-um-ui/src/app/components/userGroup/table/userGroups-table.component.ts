import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserGroupsTableService } from './userGroups-table.service';
import { Router } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';

@Component({
    selector: 'app-user-groups-table',
    templateUrl: './userGroups-table.component.html',
    styleUrls: ['./userGroups-table.component.css'],
})

export class UserGroupsTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() reload = false;
    @Input() tenantId: string;
    isShowAddUserGroupModal = false;
    isReloadUserGroupTable = false;
    currentUserGroup: any;

    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    _sortValue: any = null;

    constructor(
        private scrollSer: ScrollToTopService,
        private service: UserGroupsTableService,
        private confirmServ: NzModalService,
        private router: Router,
        private notificationService: NzNotificationService
        ) {

    }

    sort(value: any) {
        this._sortValue = value;
        this.refreshData();
    }



    showAddUserGroupModal(userGroup: any) {
        this.currentUserGroup = userGroup;
        this.isReloadUserGroupTable = false;
        this.isShowAddUserGroupModal = true;
    }

    viewDetailUserGroup(userGroup: any) {
        const roleCode = window['appConfig'].rolecode;
        let isOper = false;
        if (roleCode === 'UM_OPER_ADMIN') {
            isOper = true;
        }
        if (isOper) {
            this.router.navigate(['/tenants/userGroups/' + this.tenantId + '/viewUserGroupDetail/' + userGroup.id]);
        } else {
            this.router.navigate(['/userGroups/viewUserGroupDetail/' + this.tenantId, userGroup.id]);
        }
    }

    onSubmitUserGroupFormData(params: boolean) {
        this.isReloadUserGroupTable = params || false;
        if (this.isReloadUserGroupTable) {
            this.refreshData();
        }
    }

    showRoles(userGroup: any) {
        this.currentUserGroup = userGroup;
        this.isShowAddUserGroupModal = false;
        this.service.queryRoleByUserGroup(userGroup).then((data: any) => {
            let roleNames = '';
            if (data.success && data.data) {
                data.data.forEach((c: any, index: any) => {
                    roleNames += c.name;
                });
            }
            this.confirmServ.info({
                nzTitle: userGroup.name + '被授权的角色',
                nzContent: roleNames,
            });
        });

    }

    deleteUserGroup(userGroup: any) {
        const _this_ = this;
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: '您确定要刪除用户组\'' + userGroup.name + '\'吗？',
            nzContent: '<strong>说明：其内的用户不会被删除</strong>',
            nzOnOk: () => {
                userGroup.status = 0;
                _this_.service.updateUserGroup(userGroup).then((data: any) => {
                    if (data.success) {
                        _this_.refreshData(true);
                    } else {
                        _this_.notificationService.create('warning', '错误提示', data.message);
                    }
                });
            }
        });
    }

    hideAddUserGroupModal(params: any) {
        this.isShowAddUserGroupModal = false;
    }

    reset() {
        this.refreshData(true);
    }

    refreshData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        const params = this.queryParams || {};
        params.page = this._current;
        params.rows = this._pageSize;
        setTimeout(() => {
            if (window['appConfig'].tenant && window['appConfig'].tenant.id !== null) {
                params.tenantId = window['appConfig'].tenant.id;
            }
            this.service.getUserGroups(params).then((data: any) => {
                this._loading = false;
                this._total = data.total;
                this._dataSet = data.list;
                this.scrollSer.scrollToTop();
            });
        }, 500);
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

    ngOnInit() {
    }
}
