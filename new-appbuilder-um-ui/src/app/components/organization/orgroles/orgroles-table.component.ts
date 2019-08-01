import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UgRolesTableService } from './orgroles-table.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../@themes/scroll-service'

@Component({
    selector: 'ugroles-table',
    templateUrl: './orgroles-table.component.html',
    styleUrls: ['./orgroles-table.component.css']
})

export class UgRolesTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() userId: number;
    isShowRoleModal: boolean = false;
    currentRole: any;

    /**使用复选框**/
    @Input() refresh: boolean = false;
    @Input() reload: boolean = false;
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

    constructor(private scrollSer: ScrollToTopService, private service: UgRolesTableService, private confirmServ: NzModalService, private router: Router, private route: ActivatedRoute) {

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
        //this.queryParams.tenantId = 0;
        this._loading = false;
        let params = {};
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        params["page"] = this._current;
        params["rows"] = this._pageSize;
        params["virtualRoleId"] = this.userGroupId;
        this.service.getUgRoles(params).subscribe((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.data;
            this.scrollSer.scrollToTop()
        });

    }

    deleteRolesFormUserGroup(role: any) {
        if (!this.userGroupId) {
            this.userGroupId = this.route.snapshot.params['id'];
        }
        this.service.getUserGroupPageDetail(this.userGroupId).subscribe((data: any) => {
            if (data.success) {
                this.userGroup = data.data;
                const _this_ = this;
                let userNames = '';
                this._checkList.forEach((user: any, index: any) => {
                    userNames += user.name + ',';
                });
                userNames = userNames.substring(0, userNames.length - 1);
                let uids = '';
                this._checkList.forEach((user: any, index: any) => {
                    uids += user.id + ',';
                });
                uids = uids.substring(0, uids.length - 1);
                this.confirmServ.confirm({
                    nzTitle: '您确定要移除角色\"' + role.name + '\"吗？',
                    nzContent: '',
                    nzOnOk: () => {
                        _this_.service.deleteRolesFromUserGroup(_this_.userGroup, uids).subscribe((data2: any) => {
                            if (data2.success) {
                                const params = {
                                    virtualRoleId: _this_.userGroupId
                                };
                                _this_.service.getUgRoles(params).subscribe((data1: any) => {
                                    _this_._loading = false;
                                    _this_._dataSet = data1.list;
                                });
                            } else {
                                alert(data2.result);
                            }
                        });
                    },
                    nzOnCancel: () => {
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
        })
        this.onCheckRole.emit(this._checkList);
    }
    _checkAll(value: boolean) {
        if (value) {
            this._dataSet.forEach((data: any, index: any) => {
                data.checked = true;
            })
        } else {
            this._dataSet.forEach((data: any, index: any) => {
                data.checked = false;
            });
        }
        this._refreshStatus();
    }

    ngOnChanges(changes: SimpleChanges) {
        //this.queryParams = changes.queryParams.currentValue || {};
        this.reset();

        /**使用复选框**/
        if (this.refresh) {
            this._checkAll(false)
            this._allChecked = false;
        }
    }

    ngOnInit() {
        this.userGroupId = this.route.snapshot.params['id'];
    }
}
