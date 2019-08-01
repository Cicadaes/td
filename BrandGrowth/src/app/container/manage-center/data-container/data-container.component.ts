import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as secondLevel from '../../../ngrx/action/secondLevel';
import * as global from '../../../ngrx/action/global';
// import  service
import { CustomSourceService } from '../../../services/source/custom.source.service';
import { MediaSourceService } from '../../../services/source/media.source.service';
import { CmMessageService } from 'ng-cosmos-td-ui';

@Component({
  selector: 'data-container',
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.less'],
  providers: [
    CustomSourceService,
    MediaSourceService,
  ]
})
export class DataContainerComponent implements OnInit {
  private _dataSet: any = [];
  private search: any = '';
  private _id: any;
  constructor(
    private router: Router,
    private customSourceService: CustomSourceService,
    private mediaSourceService: MediaSourceService,
    private store$: Store<reducer.State>,
    private _message: CmMessageService,
  ) { }

  ngOnInit() {
    // tableData
    this.customSourceService.getCustomCallbackList().then((data: any) => {
      if (data.code == 200 && data.result) {
        this._dataSet = data.result;
      }
    })
  }
  // 新建数据回调
  create(name: any) {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: null,
    })
    this.router.navigate(['/manage-center/data/create-data', name])
  }
  //编辑数据回调
  edit(name: any, data: any) {
    this.store$.dispatch({
      type: secondLevel.SET_SECOND_LEVEL_ID,
      secondLevelId: data.id,
    })
    this.router.navigate(['/manage-center/data/create-data', name, data.id])
  }
  // 回调开关设置
  changeSwitch(data: any, e: any) {
    let enabled: number = 0;
    if (e.target.outerText == '停用') {
      enabled = 1;
    } else if (e.target.outerText == '启用') {
      enabled = 0;
    } else {
      enabled = -1;
    }
    let parmas = {
      id: data.id,
      enabled: enabled
    }
    // 更新回调配置开关
    this.customSourceService.updateCustomCallbackSwitch(parmas).then(res => {
    })
  }
  // 调试请求
  ping(res: any) {
    this.mediaSourceService.getChannelPingUrl(res.url).then((data: any) => {
      if ( data.code == 200) {
        if (data.result === true) {
          this._message.success('调试成功', { nzDuration: 3000 });
          res.enabled = 0;
          this.customSourceService.updateCustomCallbackSwitch({ id: res.id, enabled: res.enabled }).then(res => {
          })
        } else {
          this._message.error('调试失败', { nzDuration: 3000 });
        }
      } 
    })
  }
}
