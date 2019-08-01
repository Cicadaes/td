import { Component, OnInit, OnDestroy, Input, SimpleChanges, EventEmitter } from '@angular/core';
import { FuncAuthService } from './func-auth.service';
import { ApplistService } from '../../../../@themes/transform-service';

@Component({
  selector: 'func-auth',
  templateUrl: './func-auth.component.html',
  styleUrls: ['./func-auth.component.css']
})
export class FuncAuthComponent implements OnInit, OnDestroy {
  @Input() isSuper: boolean;
  @Input() tenantId: number;
  @Input() appList: any;
  @Input() roleId: number;
  queryParams: any = {};
  resourceTreeDatas: any[] = [];
  isSetTreeDatas = true;
  tenantAppList: any;

  private refresh: any = new EventEmitter<any>();

  constructor(private appListSer: ApplistService, private service: FuncAuthService) {

  }

  onSubmitAppData(data: any) {
    this.appList = data;
    console.dir(data);
    const pa = { vroleId: this.roleId, appList: data };
    pa.appList = this.appListSer.deleteIcon(data) || [];

    this.service.authorizeFunctionList(pa).then((data1: any) => {
      if (data1.success === true) {
        this.queryRoleAppList();
        // this.refresh.emit()
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnInit() {
    this.queryParams.id = this.roleId;
    this.queryParams.tenantId = this.tenantId;
    this.queryRoleAppList();
    this.queryTenantAppList();
  }

  queryTenantAppList() {
    const param: any = {};
    param.tenantId = this.tenantId;
    this.service.queryTenantAppList(param).then((data: any) => {
      console.dir(data);
      if (data.success === '200') {
        this.tenantAppList = data.result;
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }

  queryRoleAppList() {
    const pa = { vroleId: this.roleId };
    this.service.queryAppListByRoleId(pa).then((data: any) => {
      if (data.success === 200) {
        this.appList = data.result;
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }
  ngOnDestroy() {

  }

}
