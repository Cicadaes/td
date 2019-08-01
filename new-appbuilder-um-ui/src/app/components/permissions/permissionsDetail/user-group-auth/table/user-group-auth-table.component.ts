import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UserGroupAuthTableService } from './user-group-auth-table.service';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder } from "@angular/forms";
import { NzModalService } from 'ng-cosmos-ui';
import { ScrollToTopService } from '../../../../../@themes/scroll-service';


@Component({
  selector: 'user-group-auth-table',
  templateUrl: './user-group-auth-table.component.html',
  styleUrls: ['./user-group-auth-table.component.css']
})

export class UserGroupAuthTableComponent implements OnInit, OnChanges {
  @Input() queryParams: any;
  @Input() reload: boolean = false;
  @Input() hasOperCol: string;
  @Input() batchRemove: boolean = false;
  @Input() _tenantId: any;
  @Input() _targetId: number ;
  @Output() onChecked = new EventEmitter<any>()
  @Input() refresh: boolean = false;

  private refreshType: number = 0

  @Input() doBatchRevoke: boolean;
  @Output() onCheckUserGroup = new EventEmitter<any[]>();
  _allChecked: boolean;
  roleId: number;
  isShowAddUserGroupAuthModal: boolean = false;
  currentUserGroupAuth: any;

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet: any = [];
  _loading = true;
  _sortValue: any = null;
  _indeterminate:boolean = false;
  _checkList: any;
  _targetCode: any;
  _role: any;
  _setId: any;

  constructor(private scrollSer: ScrollToTopService, private fb: FormBuilder, private service: UserGroupAuthTableService, private confirmServ: NzModalService, private activatedRoute: ActivatedRoute, private router: Router) {
  
  }

  sort(value: any) {
    this._sortValue = value;
    this.refreshData();
  }

  reset() {
    this.refreshData(true);
  }

  // 修改点击确定时
  userEditSub() {
    console.log('管理员权限数据',this._dataSet);
    let params : any = {};
    params.targetId = this._targetId;
    params.targetCode = this._targetCode;
    let temp: any = {};
    this._dataSet.forEach((item: any) => {
      temp[item.name] = item.checked;
    });
    params.auth = JSON.stringify(temp);
    params.tenantId = this._tenantId;
    params.role = this._role;
    params.id = this._setId;
    this.service.editAdminAuths(params).then((data: any) => {
      if (data.success == true) {
        this.confirmServ.warning({
          nzTitle: '保存成功',
          nzOnCancel: () => {
          }
        });
      } else {
        this.confirmServ.warning({
          nzTitle: '保存失败',
          nzOnCancel: () => {
          }
        });
      }
    });
  }
  refreshData(reset = false) {
    let params : any = {};
    params.tenantId = this._tenantId;
    params.targetId = this._targetId;
    this.service.getAuthUserGroup(params).then((data: any) => {
      if (data.success == true) {
        this._loading = false;
        let temp: any = data.data.authBeans;
        temp.forEach((item: any) => {
          item.checked = item.hasAuth;
        });
        this._dataSet = temp;
        this._targetCode = data.data.targetCode;
        this._role = data.data.role;
        this._setId = data.data.id;
        this.checkData();
      } else {
        this._loading = false;
      }
    });
  }
/**使用复选框**/
_refreshStatus() {
  const allChecked = this._dataSet.every((value: any) => value.checked === true);
  const allUnChecked = this._dataSet.every((value: any) => !value.checked);
  this._allChecked = (this._dataSet && this._dataSet.length) ? allChecked : false
  this._indeterminate = (!allChecked) && (!allUnChecked);
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
}
  /**
   * 是否允许弹窗
   * @param  {any}    e [description]
   * @return {[type]}   [description]
   */
  checkData(e: any = null) {
    this._refreshStatus();
  }
  ngOnChanges(changes: SimpleChanges) {
  

  }

  ngOnInit() {
    this.roleId = this.activatedRoute.snapshot.params['roleId'];
    this.reset();
  }

}
