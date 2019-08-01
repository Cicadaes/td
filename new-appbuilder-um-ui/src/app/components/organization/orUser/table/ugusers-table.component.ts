import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UgUsersTableService } from './ugusers-table.service';
import { NzModalService } from 'ng-cosmos-ui';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../../@themes/scroll-service';
@Component({
  selector: 'ugusers-table',
  templateUrl: './ugusers-table.component.html',
  styleUrls: ['./ugusers-table.component.css'],
  providers: [NzModalService]
})

export class UgUsersTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() reload: boolean = false;
  isShowAddUerModal: boolean = false;
  isReloadUserTable: boolean = false;

  userGroupId: any;
  userGroup: any;
  currentUser: any;
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;


  constructor(private scrollSer: ScrollToTopService, private service: UgUsersTableService, private confirmServ: NzModalService, private router: Router, private route: ActivatedRoute) {

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
    this.service.getUserGroupPageDetail(this.userGroupId).subscribe((data: any) => {
      if (data.success) {
        this.userGroup = data.data;
        const _this_ = this;
        this.confirmServ.confirm({
          nzTitle: '您确定要移除用户\'' + user.name + '\'吗？',
          nzContent: '',
          nzOnOk: () => {
            _this_.service.deleteUserFromUserGroup(_this_.userGroup, user).subscribe((data: any) => {
              if (data.success) {
                const params = {};
                params['status'] = 1;
                params['virtualRoleId'] = _this_.userGroup.id;
                params['id'] = user.id;
                _this_.service.getUgUsers(params).subscribe((data1: any) => {
                  _this_._loading = false;
                  _this_._total = data1.total;
                  _this_._dataSet = data1.list;
                });
              } else {
                alert(data.result);
              }
            });
          },
          nzOnCancel: () => {
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
      nzTitle: '确认',
      nzContent: '確定要从' + userGroup.name + '用户组中移除' + userNames + '吗？',
      nzOnOk: () => {
        _this_.service.deleteUsersFromUserGroup(userGroup, uids).subscribe((data: any) => {
          if (data.success) {
            const params = {};
            params['status'] = 1;
            _this_.service.getUgUsers(params).subscribe((data2: any) => {
              _this_._loading = false;
              _this_._total = data2.total;
              _this_._dataSet = data2.list;
            });
          } else {
            alert(data.result);
          }
        });
      },
      nzOnCancel: () => {
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
    this.service.queryRoleByUser(user).subscribe((data: any) => {
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

  hideAddUserModal(params: any) {
    this.isShowAddUerModal = false;
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    const params = this.queryParams || {};
    params.page = this._current;
    params.rows = this._pageSize;
    params.status = 1;
    if (!this.userGroupId) {
      this.userGroupId = this.route.snapshot.params['id'];
    }
    params.virtualRoleId = this.userGroupId;
    this.service.getUgUsers(params).subscribe((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.list;
      this.scrollSer.scrollToTop()
    });

    /*this.service.getTableDatas(this._current, this._pageSize, 'name', this._sortValue,this.queryParams).subscribe((data: any) => {
        this._loading = false;
        this._total = 200;
        this._dataSet = data.results;
    })*/
  }


  /**使用复选框**/
  @Input() refresh: boolean = false;
  @Output() onCheck = new EventEmitter<any[]>();
  _allChecked = false;
  _indeterminate = false;
  _checkList: any = [];
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
    this.onCheck.emit(this._checkList);
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
