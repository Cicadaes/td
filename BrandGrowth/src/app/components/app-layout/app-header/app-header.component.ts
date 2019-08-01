import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as reducer from './../../../ngrx/reducer';
import { CmModalService } from 'ng-cosmos-td-ui';
import { SystemNoticeSourceService } from './../../../services/source/system-notice.source.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.less'],
  providers: [SystemNoticeSourceService]
})
export class AppHeaderComponent implements OnInit {
  guard$: Observable<any>;

  @Input()
  itemList: any[];
  private MarkRead: number = 0;

  noticeInfo: any = [
    {
      "content": "<p>&nbsp; &nbsp; &nbsp; TalkingData易认证（eAuth）全线升级啦，我们将竭诚为广大开发者提供高效、安全、智能、低成本的手机验证服务。</p>\n\n<ul>\n\t<li>高效</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 比短信验证平均验证时间缩短50%，有效解决短信延迟导致的用户流失问题。易认证提供自动验证、语音认证和短信认证三种方式，支持开发者在不同场景选择不同的认证方式；</p>\n\n<ul>\n\t<li>安全</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 四方交叉验证方式，有效防止刷单、恶意套利。与多家国内大规模SP合作，多个备用通道，应急措施完善；</p>\n\n<ul>\n\t<li>智能</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 自动甄别异常认证请求，智能提高认证门槛。快速扩展黑名单拦截能力，屏蔽羊毛党攻击，让真实用户享受活动福利；</p>\n\n<ul>\n\t<li>低成本</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 易认证根据开发者集成进度，分阶段赠送免费短信流量。获得免费流量同时，易认证提供多种流量优惠套餐供开发者选择。</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp; &nbsp; &nbsp; 申请试用易认证，请<a href=\">\n",
      "email": "ting.liu@tendcloud.com",
      "groupid": "8",
      "sendtime": "2018-02-01 12:10:40",
      "status": "0",
      "sysnoticeid": "3622348",
      "title": "高效·安全|TalkingData易认证全线升级",
    },
    {
      "content": "<p>&nbsp; &nbsp; &nbsp; TalkingData易认证（eAuth）全线升级啦，我们将竭诚为广大开发者提供高效、安全、智能、低成本的手机验证服务。</p>\n\n<ul>\n\t<li>高效</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 比短信验证平均验证时间缩短50%，有效解决短信延迟导致的用户流失问题。易认证提供自动验证、语音认证和短信认证三种方式，支持开发者在不同场景选择不同的认证方式；</p>\n\n<ul>\n\t<li>安全</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 四方交叉验证方式，有效防止刷单、恶意套利。与多家国内大规模SP合作，多个备用通道，应急措施完善；</p>\n\n<ul>\n\t<li>智能</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 自动甄别异常认证请求，智能提高认证门槛。快速扩展黑名单拦截能力，屏蔽羊毛党攻击，让真实用户享受活动福利；</p>\n\n<ul>\n\t<li>低成本</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 易认证根据开发者集成进度，分阶段赠送免费短信流量。获得免费流量同时，易认证提供多种流量优惠套餐供开发者选择。</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp; &nbsp; &nbsp; 申请试用易认证，请<a href=\">\n",
      "email": "ting.liu@tendcloud.com",
      "groupid": "8",
      "sendtime": "2018-02-01 12:10:40",
      "status": "0",
      "sysnoticeid": "3622348",
      "title": "高效·安全|TalkingData易认证全线升级",
    },
    {
      "content": "<p>&nbsp; &nbsp; &nbsp; TalkingData易认证（eAuth）全线升级啦，我们将竭诚为广大开发者提供高效、安全、智能、低成本的手机验证服务。</p>\n\n<ul>\n\t<li>高效</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 比短信验证平均验证时间缩短50%，有效解决短信延迟导致的用户流失问题。易认证提供自动验证、语音认证和短信认证三种方式，支持开发者在不同场景选择不同的认证方式；</p>\n\n<ul>\n\t<li>安全</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 四方交叉验证方式，有效防止刷单、恶意套利。与多家国内大规模SP合作，多个备用通道，应急措施完善；</p>\n\n<ul>\n\t<li>智能</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 自动甄别异常认证请求，智能提高认证门槛。快速扩展黑名单拦截能力，屏蔽羊毛党攻击，让真实用户享受活动福利；</p>\n\n<ul>\n\t<li>低成本</li>\n</ul>\n\n<p>&nbsp; &nbsp; &nbsp; 易认证根据开发者集成进度，分阶段赠送免费短信流量。获得免费流量同时，易认证提供多种流量优惠套餐供开发者选择。</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp; &nbsp; &nbsp; 申请试用易认证，请<a href=\">\n",
      "email": "ting.liu@tendcloud.com",
      "groupid": "8",
      "sendtime": "2018-02-01 12:10:40",
      "status": "0",
      "sysnoticeid": "3622348",
      "title": "高效·安全|TalkingData易认证全线升级",
    },
  ];

  constructor(
    private modalService: CmModalService,
    private store: Store<reducer.State>,
    private systemNoticeSourceService: SystemNoticeSourceService
  ) {
    this.guard$ = this.store.select('guard');
  }

  ngOnInit() {
    // TODO 消息提示接口联调不了 因为连不到外网
    // this.systemNoticeSourceService.getSystemNoticeList().then((data: any) => {
    //   if(data.code === 200 && data.result) {
    //     this.noticeInfo = data.result.noticeInfo;
    //   }
    // })
    /* 
      this.systemNoticeSourceService.getSystemNoticeListUnread().then((data: any) => {
        if (data.code === 200) {
          this.MarkRead = data.result;
        }
      })
    */
  }

  private isVisible: boolean = false; // 消息公告提示框状态
  showModalForComponent() {
    this.isVisible = true;
  }

  onChangeNoticeInfo(id: any, flag: boolean) {
    if (flag) {
      this.systemNoticeSourceService.getSystemMarkRead(id).then((data: any) => {});
    }
  }

}
