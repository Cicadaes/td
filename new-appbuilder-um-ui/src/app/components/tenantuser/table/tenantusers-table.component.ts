import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TenantUsersTableService } from './tenantusers-table.service';
import { NzModalService } from 'ng-cosmos-ui';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service'

@Component({
  selector: 'tenantusers-table',
  templateUrl: './tenantusers-table.component.html',
  styleUrls: ['./tenantusers-table.component.css'],
  providers: [NzModalService]
})

export class TenantUsersTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() reload: boolean = false;
  @Input() tenantId: number = 1;
  isShowAddUerModal: boolean = false;
  isReloadUserTable: boolean = false;
  currentUser: any;
  isOper: boolean = false;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;

  constructor(private scrollSer: ScrollToTopService, private service: TenantUsersTableService, private confirmServ: NzModalService, private router: Router, private route: ActivatedRoute) {

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
    this.service.queryRoleByUser(user).then((data: any) => {
      let roleNames = "";
      if (data.success && data.data) {
        data.data.forEach((c: any, index: any) => {
          roleNames += c.name;
        })
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
    setTimeout(() => {
      this._loading = true;
      let params = this.queryParams || {};
      params.page = this._current;
      params.rows = this._pageSize;
      params.tenantId = this.tenantId;
      params.virtualRoleType = "ORG";
      this.service.getUsers(params).then((data: any) => {
        this._loading = false;
        this._total = data.total;
        this._dataSet = data.list;
        // this.scrollSer.scrollToTop()
      });
    }, 300);

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
    setTimeout(() => {
      let roles = window['appConfig'].roleList;
      roles.forEach((c: any, index: any) => {
        if (c.id == 2) {
          this.isOper = true;
        }
      })
    }, 200);

  }
}
