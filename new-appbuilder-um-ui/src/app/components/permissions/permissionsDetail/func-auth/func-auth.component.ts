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
  @Input() targetId: number;

  queryParams: any = {};
  resourceTreeDatas: any[] = [];
  isSetTreeDatas: boolean = true;
  tenantAppList: any;

  private refresh: any = new EventEmitter<any>()

  constructor(private appListSer: ApplistService, private service: FuncAuthService) {

  }

  onSubmitAppData(data: any) {
    this.appList = data;
    let pa = { vroleId: this.roleId, appList: data }
    pa.appList = this.appListSer.deleteIcon(data) || []

    this.service.authorizeFunctionList(pa).then((data: any) => {
      if (data.success == true) {

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
  }

  ngOnDestroy() {

  }

}
