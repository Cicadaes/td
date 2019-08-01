import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as reducer from '../../../../ngrx/reducer';
import * as global from '../../../../ngrx/action/global';
import { CheatSourceService } from '../../../../services/source/cheat.source.service';
import { CmMessageService } from 'ng-cosmos-td-ui';
@Component({
  selector: 'protect-setting',
  templateUrl: './protect-setting-container.component.html',
  styleUrls: ['./protect-setting-container.component.less'],
  providers: [
    CheatSourceService,
  ]
})
export class ProtectSettingContainerComponent implements OnInit {

  private tradeData: any = [{
    limitCount: 0,
    paramName: "anti_impression_device_dispersion",
    paramCn: '曝光设备离散度',
    content: '12小时内，单个设备下曝光达到',
    content1: '次及以上，这些曝光将被标记为异常曝光'
  }, {
    limitCount: 0,
    paramName: "anti_impression_frequency",
    paramCn: '连续曝光',
    content: '1分钟内，单个设备下曝光达到',
    content1: '次及以上，这些曝光将被标记为连续曝光'
  }, {
    limitCount: 0,
    paramName: "anti_click_device_dispersion",
    paramCn: '点击设备离散度',
    content: '12小时内，单个IP下点击达到',
    content1: '次及以上，这些点击将被标记为异常点击'
  }, {
    limitCount: 0,
    paramName: "anti_click_frequency",
    paramCn: '点击频繁',
    content: '1分钟内，单个设备下点击达到',
    content1: '次及以上，这些点击将被标记为点击频繁'
  }, {
    limitCount: 0,
    paramName: "anti_impression_ip_dispersion",
    paramCn: '曝光IP离散度',
    content: '12小时内，单个IP下曝光达到',
    content1: '次及以上，这些曝光将被标记为异常曝光'
  }, {
    limitCount: 0,
    paramName: "anti_click_ip_dispersion",
    paramCn: '点击IP离散度',
    content: '12小时内，单个IP下点击达到',
    content1: '次及以上，这些点击将被标记为异常点击'
  }];
  private _store: any;
  constructor(
    private cheatSourceService: CheatSourceService,
    private store$: Store<reducer.State>,
    private _message: CmMessageService,
  ) {
    this._store = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe(result => {
      let key = result.activityKey ? result.activityKey : JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION')).value;

      this.cheatSourceService.getAntiCheatingList(key).then((data: any) => {
        if (data && data.result.length > 0) {
          const list = data.result;
          const value = this.tradeData.map((item: any) => {
            const count = list.filter((x: any) => item.paramName === x.paramName)[0];
            if (!!count) {
              item.limitCount = count.limitCount;
              item.activityKey = count.activityKey;
              item.limitHour = count.limitHour
            }
            return item;
          });
          this.tradeData = value;
        } else {
          this.tradeData = this.tradeData.map((item: any) => {
            item.limitCount = 0;
            item.activityKey = key;
            item.limitHour = 12
            return item;
          })
        }
      })

    })

  }

  ngOnInit() {

  }
  ngOnDestroy() {
    this._store.unsubscribe();
  }
  onAfterChange() {
  }
  // 保存设置
  save() {
    this.cheatSourceService.deleteActivity(this.tradeData).then(res => {
      if (res.code == 200) {
        this._message.success('提交成功！');
      }
    })
  }
}
