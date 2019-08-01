import { Component, OnInit, Input } from '@angular/core';
import { FuncAuthHomeService } from '../func-auth-home.service';
import { NzNotificationService } from 'ng-cosmos-ui';

@Component({
  selector: 'data-object-auth',
  templateUrl: './data-object-auth.component.html',
  styleUrls: ['./data-object-auth.component.css']
})
export class DataObjectAuthComponent implements OnInit {
  _dataSet = [];
  _roleId:any;
  _tenantId:any;

  @Input() set roleId(roleId: number){
    this._roleId = roleId;
  };
 
  @Input() set tenantId(tenantId: any){
    this._tenantId = tenantId;
  };

  param = {
    roleId: 0,
    tenantId: 0
  }
  constructor(
    private funcAuthHomeService: FuncAuthHomeService,
    private notification: NzNotificationService
  ) {
    
   }

  ngOnInit() {
    this.param.roleId = this._roleId;
    this.param.tenantId = this._tenantId;
    this.funcAuthHomeService.queryDataauthByRoleId(this.param).then(data => {
      if(data.code == 200 && data.data){
        this._dataSet = data.data;
       
      } else {
        this._dataSet = [];
      }
    })
  }

  /**
   * 更新数据对象权限
   */
  updateDataauth(){
    if(this._dataSet.length){
      this.funcAuthHomeService.updateDataauth(this._dataSet).then(data => {
        if(data.code == 200){
          this.notification.success('保存成功', '');
        } else {
          this.notification.error('error', data['message']);
        }
      })
    }
   
  }
  
}
