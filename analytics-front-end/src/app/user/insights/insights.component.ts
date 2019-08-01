import { Component, Injector, AfterViewInit, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InsightsService } from './insights.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseComponent } from '../../common/base-component';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.less'],
  providers: [InsightsService]
})
export class InsightsComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() reportObj: any = {};

  iframeUrl: SafeResourceUrl;
  height: string; // iframe高度

  selectPortraits: number; // 选中的画像组按钮
  portraits: any; // 画像组按钮
  crowd: any; // 人群信息
  tagList: any; // 中间那栏tag列表
  otherIds: any; // 其它ids
  idMaps: any; // ids类型的map
  crowdId: any; // 人群Id
  showIframe: boolean; // 用于是否显示iframe

  reportUrl: any; // 报表配置url

  fromMktPipe: boolean; // 是否是从营销的算子跳进来的
  @Input() set mktParam(param: boolean) {
    this.fromMktPipe = param;
  }

  @Output() clickExport = new EventEmitter<boolean>();

  constructor(public insightsService: InsightsService, private domSanitizer: DomSanitizer, private injector: Injector) {
    super(injector);

    this.initRouterList('画像');

    const that = this;
    that.showIframe = true;
    that.crowd = {};
    that.selectPortraits = 0;
    that.height = document.body.clientHeight - 500 + 'px';
    that.idMaps = {};
    that.otherIds = [];
  }

  ngOnInit() {
    const that = this;
    this.reportUrl = localStorage.getItem('user_group_report_url');

    that.crowdId = that.reportObj.crowdIdInput;
    if (!that.crowdId) {
      that.crowdId = that.route.snapshot.params['crowdId'];
    }

    that.insightsService.getCrowdById(that.crowdId).subscribe((data: any) => {
      if (data.code === 200) {
        that.crowd = data.data.crowd;
        if (that.crowd['features']) {
          that.tagList = that.crowd['features'].split(',');
        } else {
          that.tagList = [];
        }
        const otherIdCount = that.crowd['otherIdCount'];
        const tempIds = otherIdCount ? JSON.parse(otherIdCount) : [];
        const keys = ['_td_sdk_source'];
        that.insightsService.getParam(keys).subscribe((result: any) => {
          if (result.code === 200) {
            const dictionaryItemList = result.data['dictionaryItemList'];
            for (let i = 0; i < dictionaryItemList.length; i++) {
              that.idMaps[dictionaryItemList[i].id] = dictionaryItemList[i]['dicItemValue'];
            }
            let count = 0;
            for (const key in tempIds) {
              if (tempIds.hasOwnProperty(key)) {
                const json = {
                  name: key == '0' ? '未知' : that.idMaps[key],
                  value: tempIds[key]
                };
                count += tempIds[key];
                that.otherIds.push(json);
              }
            }
            for (let i = 0; i < that.otherIds.length; i++) {
              that.otherIds[i]['percent'] =
                +that.otherIds[i]['value'] === 0 ? 0 : ((+that.otherIds[i]['value'] / count) * 100).toFixed(2);
              that.otherIds[i]['value'] = that.otherIds[i]['value'].toLocaleString();
            }
          } else {
            that.notification.create('warning', '错误提示', data.message);
          }
        });
      }
    });
    that.insightsService.getPortraitsGroup().subscribe((data: any) => {
      if (data.code === 200) {
        that.portraits = data.data.rows;
        if (that.portraits.length > 0) {
          let urlPart1 = '&custom=1&components=0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0',
            urlPart2 = '&isShowPubStatus=0&isShowPages=0&isShowSaveTpl=0&isShowUnit=0&isFilterType=0';
          that.iframeUrl = that.domSanitizer.bypassSecurityTrustResourceUrl(
            `${that.reportUrl}/studio/#/publish/${that.portraits[0].reportId}?crowd_id=${that.crowdId}&product_id=${
              that.productId
            }&token=${localStorage.getItem('token')}${urlPart1}${urlPart2}`
          );
        }
      } else {
        that.notification.create('warning', '错误提示', data.message);
      }
    });
  }

  ngAfterViewInit(): void {
    //        const that = this;
  }

  // 显示人群画像
  showChars(index: any) {
    const that = this;
    that.selectPortraits = index;
    that.showIframe = false;
    let urlPart1 = '&custom=1&components=0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0',
      urlPart2 = '&isShowPubStatus=0&isShowPages=0&isShowSaveTpl=0&isShowUnit=0&isFilterType=0';
    that.iframeUrl = that.domSanitizer.bypassSecurityTrustResourceUrl(
      `${that.reportUrl}/studio/#/publish/${that.portraits[index].reportId}?crowd_id=${that.crowdId}&product_id=${
        that.productId
      }&token=${localStorage.getItem('token')}${urlPart1}${urlPart2}`
    );

    setTimeout(() => {
      that.showIframe = true;
    }, 1);
  }

  goCreateCrowd() {
    const that = this;

    this.commonService.goInto({
      name: '创建子人群',
      url: `/crowd-create/createChild`,
      params: {
        parentId: that.crowdId
      }
    });
  }

  goExport() {
    const that = this;
    that.clickExport.emit(true);
    this.commonService.goInto({
      name: '导出',
      url: `/crowd-export`,
      params: {
        crowdId: that.crowdId
      }
    });
  }

  goSubCrowd() {
    const that = this;

    this.commonService.goInto({
      name: '子人群列表',
      url: `/user/user-group/child`,
      params: {
        id: that.crowdId
      }
    });
  }
}
