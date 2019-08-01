import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { RolesService } from '../../roles.service';
import { NzModalService } from 'ng-cosmos-ui';
import { RoleListService } from '../../../../@themes/transform-service';
import { ScrollToTopService } from '../../../../@themes/scroll-service';

@Component({
  selector: 'tenant-roles-table',
  templateUrl: './tenant-roles-table.component.html',
  styleUrls: ['./tenant-roles-table.component.css']
})

export class TenantRolesTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() tenantId = 0;
  @Input() reload = false;
  @Input() userId = 0;
  isReloadUserTable = false;
  // @Input() role:any;
  role: any;
  isOper = false;

  roleIndex: number;
  isShowAddRoleModal = false;

  private nameList: any = [];

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;

  constructor(private scrollSer: ScrollToTopService, private roleListSer: RoleListService, private service: RolesService, private confirmServ: NzModalService) {
    this.getRoleCode();
  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }
  getRoleCode(): void {
    this.service.getRoleCode().then((roleCode: any) => {
      console.log(roleCode);
      this.isOper = (roleCode === 'UM_OPER_ADMIN');
    }).catch((err: any) => {
      console.log(err);
    });
  }

  showEditRoleModal(role: any, roleIndex: number) {
    this.role = role;
    this.roleIndex = roleIndex;
    this.isShowAddRoleModal = true;
  }

  hideAddRoleModal(newRole: any) {
    this.isShowAddRoleModal = false;
  }

  deleteRole(role: any, roleIndex: number) {
    this.confirmServ.confirm({
      nzTitle: '您确定要删除角色“' + role.name + '”吗？',
      nzContent: '<strong>说明：其内的用户不会被删除</strong>',
      nzOnOk: () => {
        role.status = 0;
        this._loading = true;
        this.service.modifyRole(role).then((data: any) => {

          if (data.success === true) {
            // this._dataSet.splice(roleIndex, 1);
            this.confirmServ.warning({
              nzTitle: '删除成功',
              nzOnCancel() {
              }
            });
            this.refreshData(true);
          } else {
            this.confirmServ.warning({
              nzTitle: data.msg,
              nzOnCancel() {
              }
            });
          }
          this.isShowAddRoleModal = false;
          this._loading = false;
        });
      }
    });
  }

  refreshData(reset = false) {
    this.scrollSer.scrollToTop();
    if (reset) {
      this._current = 1;
    }
    const params = this.queryParams || {};
    params.tenantId = this.tenantId;

    params.page = this._current;
    params.rows = this._pageSize;

    this._loading = true;
    setTimeout(() => {
      this.service.queryTenantRolesByPage(params).then((data: any) => {
        if (data.success === true) {
          this._dataSet = data.data;
          console.log(this._dataSet);
          // this._dataSet = this.roleListSer.rmDefaultItem(this._dataSet)
          // this._total = this._dataSet.length
          this._total = data.total;

          this.setNameList(this._dataSet);
        }
        this._loading = false;
      });
    }, 500);
  }

  onSubmitUserFormData(params: boolean) {
    this.isReloadUserTable = params || false;
    this.refreshData();
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

    if (this.reload === true) {
      this.refreshData();
    } else {
      this.reset();
    }
  }

  ngOnInit() {
    // this.reset();
  }

  setNameList(data: any) {
    this.nameList = '';
    if (data && data.length) {
      this.nameList = data.map((item: any) => {
        return item.name;
      });
    }
  }

}
