import { Component, OnInit } from '@angular/core';
import { MonitorgroupSourceService } from '../../../../services/source/monitorgroup.source.service';

import { Router } from '@angular/router'

import { Store } from '@ngrx/store';

import * as reducer from '../../../../ngrx/reducer';
import * as secondLevel from '../../../../ngrx/action/secondLevel';
@Component({
  selector: 'connect-setting',
  templateUrl: './connect-setting-container.component.html',
  styleUrls: ['./connect-setting-container.component.less'],
  providers: [
    MonitorgroupSourceService,

  ]
})

export class ConnectSettingContainerComponent implements OnInit {
  private _dataSet: any = []; //table数据
  private _allChecked = false;  //是否全部选中
  private _disabledButton = true;  //删除按钮是否显示
  private _checkedNumber = 0;    //选中个数
  private _displayData: Array<any> = [];
  // private _operating = false;  //
  private activityKey: any;
  private searchText: any = ''; //搜索内容
  private _store: any;  //状态管理
  constructor(
    private monitorgroupSourceService: MonitorgroupSourceService,
    private router: Router,
    private store$: Store<reducer.State>,

  ) {
    this._store = this.store$.select('global').subscribe(result => {
      this.activityKey = result.activityKey ? result.activityKey : JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_OPTION")).value,
        this.refreshTabList();
    })
  }

  ngOnInit() {
    this.refreshTabList()
  }

  refreshTabList() {
    this.monitorgroupSourceService.getMonitorgroupListByKey(this.activityKey).then((data: any) => {
      this._dataSet = data.result;
    })
  }

  _displayDataChange($event: any) {
    this._displayData = $event;
  }

  _refreshStatus() {
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._disabledButton = !this._dataSet.some((value: any) => value.checked);
    this._checkedNumber = this._dataSet.filter((value: any) => value.checked).length;
  }
  // 全选
  _checkAll(value: any) {
    if (value) {
      this._displayData.forEach(data => data.checked = true);
    } else {
      this._displayData.forEach(data => data.checked = false);
    }
    this._refreshStatus();
  }

  _deteleData() {
    this._displayData.forEach((value: any) => {
      if (value.checked == true) {
        this.monitorgroupSourceService.deleteMonitorgroup(value.id).then((res: any) => {
          this.refreshTabList()
        })
      }
    })
    this._refreshStatus();
  }
  // 编辑
  edit(data: any) {
    this.router.navigate(['activity/setting/connect-setting/create-connect', ' 编辑监测链接组', data.id])
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: data.id,
    })

  }
  // 新建
  create(name: any) {
    this.router.navigate(['activity/setting/connect-setting/create-connect', name])
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_NAME,
      secondLevelName: name
    })
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: null,
    })

  }

  ngOnDestroy() {

    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: null,
    })
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_NAME,
      secondLevelName: null
    })

  }


}