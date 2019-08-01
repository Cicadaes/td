import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
/*import { UserAuthTableService } from './user-auth-table.service';*/
import { RolesService } from '../../../../roles.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../../../@themes/scroll-service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


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

  @Output() canShow = new EventEmitter<Boolean>();

  isShowAddUserAuthModal = false;
  currentUserAuth: any;
  _allChecked: boolean;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = false;
  _sortValue: any = null;
  tenantId: any;
  roleId: any;
  userId: any;
  _indeterminate = false;
  _checkAll = (isCheckAll: any) => {
    this._dataSet.forEach((ug: any) => ug.checked = isCheckAll);
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
      if (item.checked) {
        this.canShow.emit(true);
        return;
      }
    }
    this.canShow.emit(false);
  }

  constructor(
    private scrollSer: ScrollToTopService,
    private service: RolesService,
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

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }

    const params = this.queryParams || {};
    params.page = this._current;
    params.rows = this._pageSize;

    this._loading = true;

    this.service.queryRoleUserByPage(params).then((data: any) => {
      if (data.success === true) {
        this._total = data.total;
        this._dataSet = data.data;
        if (this._dataSet.length > 0) {
          this.userId = this._dataSet[0].id;
        }
        this.scrollSer.scrollToTop();
      }
      this._loading = false;
      this.isReloadData = false;

      this.checkData();
      // this._refreshStatus()
    });
  }
  batchRevokeUser(arr: any) {
    this.service.batchRevokeUser(arr).then((data: any) => {
      if (data.success === true) {
        this.reset();
      }
    });
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

    this.tenantId = this.queryParams.tenantId;
    this.roleId = this.queryParams.vroleId;
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
    const allChecked = this._dataSet.every((value: any) => value.checked === true);
    const allUnChecked = this._dataSet.every((value: any) => !value.checked);
    // this._allChecked = allChecked;
    this._allChecked = (this._dataSet && this._dataSet.length) ? allChecked : false;
    this._indeterminate = (!allChecked) && (!allUnChecked);
    // this.checkData()
    // this.callbackSelect()
  }

  replaceUser(data: any) {
    this.isShowAddUserAuthModal = true;
    this.isReloadData = false;
    console.log();
  }

  hideAddUserAuthModal(params: any) {
    this.isShowAddUserAuthModal = false;
  }

  onSubmitUserAuthData(submitted: boolean) {
    console.log('=====>123');
    this.isReloadData = submitted;
    this.refreshData(true);
  }
}
