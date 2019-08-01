import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as reducer from './../../../ngrx/reducer';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

const _ = require('lodash');
import * as moment from 'moment';

// import Services
import { MediaSourceService } from '../../../services/source/media.source.service';
import { DictSourceService } from '../../../services/source/dict.source.service';
import { MonitorSourceService } from '../../../services/source/monitor.source.service';
import { MonitorgroupSourceService } from './../../../services/source/monitorgroup.source.service';

// import Components
import { FiltrateCardComponent } from './filtrate-card/filtrate-card.component';
import { FilterPercentPipe } from '../../../pipes/filter-percent.pipe';

@Component({
  selector: 'chain-container',
  templateUrl: './chain-container.component.html',
  styleUrls: ['./chain-container.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    MediaSourceService,
    DictSourceService,
    MonitorSourceService,
    MonitorgroupSourceService,
    FilterPercentPipe,
  ]
})
export class ChainContainerComponent implements OnInit, OnDestroy {
  // 将获取的渠道和广告格式列表传到子组件里面
  // 使用 _newChannels 的原因是因为不能直接改变用来保存数据的列表 
  private _channels: any = [];             // 渠道列表
  private _adFormats: any = [];            // 广告格式  
  private _monitorgroupList: any = [];     // 监测链接组列表
  private _newChannels: any = [];          // 组件使用的渠道列表
  private _newAdFormats: any = [];         // 组件使用的广告格式列表
  private _newMonitorgroupList: any = [];  // 组件使用的监测链接组列表

  // table相关数据
  private _datacontent: any = [];   // table数据
  private _inputValue: any = '';    // 搜索框的值
  filterDieSpread: boolean = true;  // 是否过滤僵尸活动

  dimensionValue: any = 'monitor';

  // table下载参数
  private _csvParams: any;

  // 用来取消订阅的
  private subscription: Subscription;

  // 处理指标排序
  sortMap: any = {
    impression_pv : null,
    impression_uv : null,
    click_pv      : null,
    click_uv      : null,
    click_rate    : null
  };

  // 获取子组件 FiltrateCardComponent 的实例
  @ViewChild(FiltrateCardComponent) filtrateCard: FiltrateCardComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store$: Store<reducer.State>,
    private mediaSourceService: MediaSourceService,
    private dictSourceService: DictSourceService,
    private monitorSourceService: MonitorSourceService,
    private monitorgroupSourceService: MonitorgroupSourceService,
    private filterPercentPipe: FilterPercentPipe,
  ) {}

  ngOnInit() {
    // 初始化渠道列表
    this.mediaSourceService.getChannelList().then((data: any) => {
      if (data && data.result) {
        this._channels = data.result;
      }
    });

    // 初始化广告格式列表
    this.dictSourceService.getAdTypeList().then((data: any) => {
      if (data && data.result) {
        this._adFormats = data.result;
      }
    });

    // 监听全局信息是否改变
    this.subscription = this.store$.select('global').debounceTime(1000).distinctUntilChanged().subscribe((data: any) => {
      const activityKey = data && data.activityKey;
      this.filtrateCard.selectAdformat = null;
      this.filtrateCard.selectChannel = null;
      this.filtrateCard.selectGroupItem = null;
      // 初始化监测链接组列表
      this.monitorgroupSourceService.getMonitorgroupListByKey(activityKey).then((data: any) => {
        if (data && data.result) {
          this._monitorgroupList = data.result;
        }
      })
    })
  }

  /**
   * 过滤可选的渠道和广告格式列表
   * @param list 监测链接列表
   */
  filterSelectOptions(list: any): void {
    if (this.dimensionValue === 'monitor') {
      this._newAdFormats = [];
      this._newChannels = [];
    }
    this._newMonitorgroupList = [];

    list.map((item: any) => {
      this._channels.map((channel: any) => {
        if (this.dimensionValue === 'monitor') {
          if (channel.id === item.channelId) {
            this._newChannels.push(channel);
          }
        } 
        
        if (this.dimensionValue === 'media') {
          this._newChannels = _.cloneDeep(this._newChannels);
        }
      });
      this._adFormats.map((adFormat: any) => {
        if (this.dimensionValue === 'monitor') {
          if (adFormat.id === item.adType) {
            this._newAdFormats.push(adFormat);
          }
        } 
        
        if (this.dimensionValue === 'media') {
          this._newAdFormats = _.cloneDeep(this._newAdFormats);
        }
      });
      this._monitorgroupList.map((monitorgroup: any) => {
        if (item.groupList) {
          item.groupList.map((glItem: any) => {
            if (this.dimensionValue === 'monitor') {
              if (monitorgroup.id === glItem.groupId) {
                this._newMonitorgroupList.push(monitorgroup);
              }
            } 
            
            if (this.dimensionValue === 'media'){
              glItem.forEach((gl: any) => {
                if (monitorgroup.id === gl.groupId) {
                  this._newMonitorgroupList.push(monitorgroup);
                }
              });
            }
          })
        }
      });
      
      // 数组去重 RepeatedArray = Array.from(new Set(RepeatArray))
      this._newChannels = Array.from(new Set(this._newChannels));
      // this._newChannels = [];
      this._newAdFormats = Array.from(new Set(this._newAdFormats));
      // this._newAdFormats = [];
      this._newMonitorgroupList = Array.from(new Set(this._newMonitorgroupList));
      // this._newMonitorgroupList = [];
    });
  }

  /**
   * 整理监测链接列表
   * @param list 监测链接列表
   */
  getMetricData(list: any): void {
    if (this.dimensionValue === 'media') {
      this._newChannels.forEach((ch: any) => {
        let existingItem = list.find((item: any) => item.channelName === ch.localName);
        if (!existingItem) {
          list.push({
            channelName: ch.localName,
            impression_pv: 0,
            impression_uv: 0,
            click_pv: 0,
            click_uv: 0
          });
        }
      });
    }
    this._datacontent = _.cloneDeep(list);
    // 过滤选择项
    this.filterSelectOptions(list);

    // this._newAdFormats = this._adFormats;
    // this._newChannels = this._channels;

    // 如果监测链接列表的长度大于0， 那么就在数组末尾添加总计
    if(list.length > 0) {
      Observable.from(list).startWith({
        monitorName: '总计',
        impression_pv: 0,
        impression_uv: 0,
        click_pv: 0,
        click_uv: 0,
        total: true,
      }).reduce((original: any, expend: any) => {
        return {
          monitorName: expend.monitorName,
          channelName: expend.channelName,
          impression_pv: expend.impression_pv + original.impression_pv,
          impression_uv: expend.impression_uv + original.impression_uv,
          click_pv: expend.click_pv + original.click_pv,
          click_uv: expend.click_uv + original.click_uv,
          total: true,
        }
      }).last().subscribe((result: any) => {
        if (result.monitorName) {
          result.monitorName = "总计"
        } else {
          result.channelName = "总计"
        }
  
        if(this.filtrateCard.selectChannel && this.filtrateCard.selectChannel.id) {
          result.channelId = this.filtrateCard.selectChannel.id;
        }
  
        if(this.filtrateCard.selectAdformat && this.filtrateCard.selectAdformat.id) {
          result.adType = this.filtrateCard.selectAdformat.id;
        }
  
        this._datacontent.push(result);
      })
    }
    
    // 整理报表信息
    this.assembleReport();
  }

  /**
   * 整理报表信息
   */
  assembleReport(): void {
    let csvText = '名称,曝光,独立曝光,点击,独立点击,点击率';
    // 活动名称
    let activityName = JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_OPTION")).label;
    // 页面名称
    let pageName = '监测链接'
    // 模块
    let moduleName = '监测链接列表'
    // 时间区间
    let timeStamp = moment(JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_TIME"))[0]).format('YYYY-MM-DD') + '_' + moment(JSON.parse(localStorage.getItem("TD_BG_ACTIVITY_TIME"))[1]).format('YYYY-MM-DD');

    // 拼接报表内容
    this._datacontent.forEach((el: any) => {
      moduleName = el.monitorName ? '监测链接列表' : '渠道列表'
      csvText += `\r\n${el.monitorName ? el.monitorName : el.channelName},${el.impression_pv},${el.impression_uv},${el.click_pv},${el.click_uv},${this.filterPercentPipe.transform(el.click_pv / el.impression_pv)}`;
    });

    // 拼接导出报表需要的参数
    this._csvParams = {
      filename: `${activityName}_${pageName}_${moduleName}_${timeStamp}.csv`,
      data: csvText
    };
  }

  /**
   * 跳转到新建监测链接页面
   */
  toCreateChain() {
    this.router.navigate(['/activity/chain/create', '新建监测链接']);
  }

  /**
   * 跳转到监测链接详情
   * @param name 监测链接名
   * @param id 监测链接id
   */
  toMonitorDetail(name: any, id: any): void {
    this.router.navigate(['/activity/chain/details', name, id])
  }

  /**
   * 获取子组件抛出的搜索框的值
   * @param value 搜索的值
   */
  getFilteredData(value: any): void {
    this._inputValue = value;
  }

  /**
   * 标记监测链接
   * @param activityKey 营销活动key
   * @param monitorLinkId 监测链接id
   */
  markImportMonitorLink(activityKey: string, monitorLinkId: string) {
    this.monitorSourceService.markImportMonitorLink({
      activityKey,
      monitorLinkId
    }).then((result: any) => {
      if (result.code === 200) {
        this.filtrateCard.getMetricData();
      }
    });
  }

  /**
   * 取消监测链接的标记
   * @param activityKey 营销活动key
   * @param monitorLinkId 监测链接id
   */
  cancleImportMonitorLink(activityKey: string, monitorLinkId: string): void {
    this.monitorSourceService.cancleImportMonitorLink({
      activityKey,
      monitorLinkId
    }).then((result: any) => {
      if (result.code === 200) {
        this.filtrateCard.getMetricData();
      }
    });
  }

  /**
   * 删除监测链接
   * @param activityKey 营销活动key
   * @param monitorLinkId 监测链接id
   */
  deleteMonitorLink(activityKey: string, monitorLinkId: string): void {
    this.monitorSourceService
      .deleteMonitorLink(activityKey, monitorLinkId)
      .then((result: any) => {
        if (result.code === 200) {
          this.filtrateCard.getMetricData();
        }
      });
  }

  /**
   * 去掉？
   * @param item 一条监测链接信息
   */
  removeLastQuestionMark(item: any): string {
    let url = item.urlShort;
    if (!!url && url.charAt(url.length) === '?') {
      return url.slice(0, -1)
    }
    if (item.channelOptions && item.channelOptions[0] && item.channelOptions[0].optVal) {
      url += item.channelOptions[0].optVal + "&";
    } else {
      url = url + "?";
    }
    return url;
  }

  /**
   * 排序
   * @param sortName 字段名
   * @param value    参数
   */
  sort(sortName: string, value?: any): void {
    Object.keys(this.sortMap).forEach(key => {
      if (key !== sortName) {
        this.sortMap[ key ] = null;
      } else {
        if (value) {
          this.sortMap[ key ] = value;
        } else {
          this.sortMap[ key ] = this.sortMap [key] === 'descend' ? 'ascend' : 'descend';
        }
      }
    });
    let totalItem = this._datacontent[this._datacontent.length - 1];
    this._datacontent = this._datacontent.slice(0, this._datacontent.length - 1);
    this._datacontent = [ ...this._datacontent.sort((a: any, b: any) => {
      if (a[sortName] > b[sortName]) {
        if (value) {
          return (value === 'ascend') ? 1 : -1;
        } else {
          return this.sortMap[ sortName ] === 'ascend' ? 1 : -1;
        }
      } else if (a[sortName] < b[sortName]) {
        if (value) {
          return (value === 'ascend') ? -1 : 1;
        } else {
          return this.sortMap[ sortName ] === 'ascend' ? -1 : 1;
        }
      } else {
        return 0;
      }
    }) ];
    this._datacontent.push(totalItem);
  }

  /**
   * 排序
   * @param firstSortName 字段名1
   * @param secondSortName 字段名2
   * @param value    参数
   */
  sortClickRate(firstSortName: string, secondSortName: string, value: any) {
    Object.keys(this.sortMap).forEach(key => {
      if (key !== 'click_rate') {
        this.sortMap[ key ] = null;
      } else {
        if (value) {
          this.sortMap[ key ] = value;
        } else {
          this.sortMap[ key ] = this.sortMap [key] === 'descend' ? 'ascend' : 'descend';
        }
      }
    });
    let totalItem = this._datacontent[this._datacontent.length - 1];
    this._datacontent = this._datacontent.slice(0, this._datacontent.length - 1);
    this._datacontent = [ ...this._datacontent.sort((a: any, b: any) => {
      let aRate = a[firstSortName] / a[secondSortName];
      let bRate = b[firstSortName] / b[secondSortName];
      if (aRate > bRate) {
        if (value) {
          return (value === 'ascend') ? 1 : -1;
        } else {
          return this.sortMap[ 'click_rate' ] === 'ascend' ? 1 : -1;
        }
      } else if (aRate < bRate) {
        if (value) {
          return (value === 'ascend') ? -1 : 1;
        } else {
          return this.sortMap[ 'click_rate' ] === 'ascend' ? -1 : 1;
        }
      } else {
        return 0;
      }
    }) ];
    this._datacontent.push(totalItem);
  }

  getDimensionValue(value: any) {
    this.dimensionValue = value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
