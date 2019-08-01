import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UsersTableService } from './users-table.service';
import { FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-cosmos-ui';
import { forEach } from '@angular/router/src/utils/collection';
import { ScrollToTopService } from '../../../@themes/scroll-service';

@Component({
  selector: 'users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
  providers: [NzModalService]
})

export class UsersTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() reload = false;
  isShowAddUerModal = false;
  isReloadUserTable = false;
  currentUser: any;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;

  private locale: any = {
    emptyText: '暂无数据'
  };

  testdd: 'afafdkdd';

  constructor(private scrollSer: ScrollToTopService, private service: UsersTableService, private confirmServ: NzModalService) {

  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  showAddUserModal(user: any) {
    this.currentUser = user;
    this.isReloadUserTable = false;
    this.isShowAddUerModal = true;
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
    user.userId = user.id;
    this.service.queryRoleByUser(user).then((response: any) => {
      if (response.data && response.data.length > 0) {
        let roleNames = '';
        if (response.success && response.data) {
          response.data.forEach((c: any, index: any) => {
            roleNames += c.name + '&nbsp;&nbsp;&nbsp;&nbsp;';
          });
        }
        this.confirmServ.info({
          nzTitle: user.name + '被授权的角色',
          nzContent: roleNames
        });
      } else {
        this.confirmServ.info({
          nzTitle: user.name + '被授权的角色',
          nzContent: '暂无角色'
        });
      }
    }).catch((err: any) => {
      console.log(err);
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
    params.tenantId = 0;
    this.service.getUsers(params).then((response: any) => {
      this._loading = false;
      this._total = response.total;
      this._dataSet = response.list;
      this.scrollSer.scrollToTop();
    }).catch((err: any) => {
      console.log(err);
    });
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
