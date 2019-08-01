import { Component, OnInit } from '@angular/core';
// import { CmMessageService } from 'ng-cosmos-td-ui';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as global from '../../../ngrx/action/global';
import * as secondLevel from '../../../ngrx/action/secondLevel';
@Component({
  selector: 'setting-container',
  templateUrl: './setting-container.component.html',
  styleUrls: ['./setting-container.component.less'],
 
})
export class SettingContainerComponent implements OnInit {
  private tabs = [
    {
      name: '基本信息',
      id: 1
    },
    {
      name: '作弊防护设置',
      id: 2
    },
    {
      name: '监测连接组管理',
      id: 3
    }
  ];
  private selectedIndex:any = 1;
  constructor(
    private router:Router,
  ) {
    if(sessionStorage.getItem('TD_BG_ACTIVITY_SETTING_INDEX')){
      this.selectedIndex = sessionStorage.getItem('TD_BG_ACTIVITY_SETTING_INDEX');
      sessionStorage.clear();
    }
   }
  ngOnInit() {
  }
  changes(i:any){
    this.selectedIndex=i;
    if(i==1){
      this.router.navigate(['/activity/setting/base-setting'])
    }else if(i==2){
     this.router.navigate(['/activity/setting/protect-setting'])
   }else{
     this.router.navigate(['/activity/setting/connect-setting'])
   }
}
}
