import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { OrgRolesTableService } from './orgroles-table.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ScrollToTopService } from '../../../../@themes/scroll-service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
    selector: 'orgroles-table',
    templateUrl: './orgroles-table.component.html',
    styleUrls: ['./orgroles-table.component.css']
})

export class OrgRolesTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() userId: number;
    @Input() isUserRelation = false;
    @Input() organization: any;
    isShowRoleModal = false;
    currentRole: any;

    @Input() tenantId: any;

    /**使用复选框**/
    @Input() refresh = false;
    @Input() reload = false;
    @Output() onCheckRole = new EventEmitter<any[]>();
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

    constructor(
        private scrollSer: ScrollToTopService,
        private service: OrgRolesTableService,
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

    showRoleModal(role: any) {
        this.currentRole = role;
        this.isShowRoleModal = true;
    }

    hideRoleModal(params: any) {
        this.isShowRoleModal = false;
    }

    refreshData(reset = false) {
        this.scrollSer.scrollToTop();
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        this._loading = false;
        const params = {};
        params['page'] = this._current;
        params['rows'] = this._pageSize;
        params['virtualRoleId'] = this.organization.id;
        params['tenantId'] = this.organization.tenantId;
        this.service.getUgRoles(params).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
        });

    }

    deleteRolesFormUserGroup(role: any) {
        const _this_ = this;
        this.confirmServ.confirm({
            nzMaskClosable: false,
            nzTitle: '您确定要移除角色\'' + role.name + '\'吗？',
            nzContent: '',
            nzOnOk() {
                _this_.service.deleteRolesFromUserGroup(_this_.organization, role.id).then((data: any) => {
                    if (data.success) {
                        const params = {
                            page: 1,
                            rows: 10,
                            tenantId: _this_.organization.tenantId,
                            virtualRoleId: _this_.organization.id
                        };
                        _this_.service.getUgRoles(params).then((response: any) => {
                            _this_._loading = false;
                            _this_._dataSet = response.list;
                            _this_._total = response.total;
                        });
                    } else {
                        alert(data.result);
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
        this.onCheckRole.emit(this._checkList);
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
