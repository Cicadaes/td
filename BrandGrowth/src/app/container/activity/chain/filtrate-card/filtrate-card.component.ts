import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';

// import Services
import { IndicatorsSourceService } from './../../../../services/source/indicators.source.service';
import { Store } from '@ngrx/store';
import * as reducer from './../../../../ngrx/reducer';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'filtrate-card',
  templateUrl: './filtrate-card.component.html',
  styleUrls: ['./filtrate-card.component.less']
})
export class FiltrateCardComponent implements OnChanges, OnInit, OnDestroy {
  @Input() channels: any[];                  // 渠道列表
  @Input() adFormats: any[];                 // 广告列表
  @Input() groupList: any[];                 // 监测链接组列表
  @Input() channelsLength: number = 0;       // 渠道列表长度
  @Input() filterDieSpread: boolean = true;  // 是否过滤僵尸推广活动

  // 当渠道或广告列表选项被改变的时候，触发回调，抛出监测链接列表
  @Output() onSelectorChange = new EventEmitter<any>();
  @Output() onDimensionChange = new EventEmitter<any>();

  // 已选择的项
  selectChannel: any = null;   // 已选择的渠道
  selectAdformat: any = null;  // 已选择的广告格式
  selectGroupItem: any = null; // 已选择的广告格式

  // 从store取出全局数据
  private _startTime: number = null; // 开始时间
  private _endTime: number = null;   // 结束时间
  private _compaignKey: string = ''; // 活动key

  // 指标查询配置项
  private _metrics = ["impression_pv", "impression_uv", "click_pv", "click_uv"]; // 指标
  private _dimension = { value: 'monitor', label: '监测链接' };                   // 条件 默认选择监测链接

  // 切换不同的列表
  _options = [
    { value: 'monitor', label: '监测链接' },
    { value: 'media', label: '渠道' },
  ];

  // 订阅器 OnDestroy时取消订阅
  subscription: Subscription = null;

  constructor(
    private indicatorsSourceService: IndicatorsSourceService,
    private store$: Store<reducer.State>
  ) {
    // 取出需要的全局信息
    this.subscription = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe(result => {
      this._startTime = result.startTime;     // 开始时间
      this._endTime = result.endTime;         // 结束时间
      this._compaignKey = result.activityKey; // 活动的key

      this.getMetricData();                   // 请求监测链接列表，并在成功请求后抛出到父组件
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    // 当过滤僵尸推广活动单选框改变的时候，重新去请求监测链接列表
    if (changes && changes.filterDieSpread && changes.filterDieSpread.currentValue !== changes.filterDieSpread.previousValue) {
      this.getMetricData();
    }
  }

  ngOnInit() {
    // 没有限定渠道和广告格式，然后去请求监测链接列表
    this.getMetricData();
  }

  /**
   * 选择渠道和广告格式
   * @param type media 渠道  adType  广告格式
   * @param item 被选择的item
   */
  chooseSelector(type: string, item: any): void {
    this[`select${type}`] = item;

    this.getMetricData();
  }

  /**
   * 将对应的选择项置为null
   * @param type media 渠道  adType  广告格式
   */
  removeSelector(type: string): void {
    this[`select${type}`] = null;
    this.getMetricData();
  }

  /**
   * 查询监测链接列表
   */
  getMetricData(): void {
    this.onDimensionChange.emit(this._dimension.value);
    let params = {
      "metrics": this._metrics,
      "dimension": this._dimension.value,
      "conditions": {
        "activityKey": this._compaignKey,
        "start": moment(this._startTime).format('YYYY-MM-DD'),
        "end": moment(this._endTime).format('YYYY-MM-DD')
      },
      "detail": true,
    };

    if (this._dimension.value == 'monitor') {
      params['filterDieSpread'] = this.filterDieSpread;
    }

    // 判断是否有选择渠道或者广告类型或者监测链接组
    if (this.selectChannel && this.selectChannel.id) {
      params.conditions['channelId'] = this.selectChannel.id;
    }
    if (this.selectAdformat && this.selectAdformat.id) {
      params.conditions['adType'] = this.selectAdformat.id;
    }
    if (this.selectGroupItem && this.selectGroupItem.id) {
      params.conditions['groupId'] = this.selectGroupItem.id;
    }

    if (this._compaignKey) {
      this.indicatorsSourceService.queryMetricData(params).then((data: any) => {
        if (data.result) {
          let arrTmp = [
            ...data.result.sort((a: any, b: any) => {
              if (a['impression_pv'] > b['impression_pv']) {
                return -1
              } else if (a['impression_pv'] < b['impression_pv']) {
                return 1
              } else {
                return 0;
              }
            })
          ];
          arrTmp.forEach((item: any) => {
            if (item.monitorName) {
              delete item.channelName;
            }
          });

          this.onSelectorChange.emit(arrTmp);
        } else {
          this.onSelectorChange.emit([]);
        }
      })
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
