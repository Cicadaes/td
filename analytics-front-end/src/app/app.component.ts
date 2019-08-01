import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common/services/common.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NzOptionContainerComponent } from 'ng-zorro-antd';
import { CurdService } from './curd.service';
import { AppService } from './app.service';
import { DomSanitizer } from '@angular/platform-browser';

import { saveMessage, getMessage } from './utils/post-message';
import { AuthService } from './common/services/auth.service';
import { AppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent extends AppConfig implements OnDestroy {
  constructor(
    public curdService: CurdService,
    public appService: AppService,
    private authService: AuthService,
    public router: Router,
    public commonService: CommonService,
    public domSanitizer: DomSanitizer
  ) {
    super(commonService, router, domSanitizer);

    const that = this;
    this.getSysConfigs();
    // 与报表通信
    window.addEventListener('message', function(e: any) {
      try {
        const data = JSON.parse(e.data);
        switch (data.eventType) {
          case 'save':
            saveMessage(data.eventInfo);
            break;
          case 'get':
            _that.queryPostMessage(data.eventInfo);
            break;
          case 'redirect':
            _that.curdService.redirect();
            break;
          case 'router':
            _that.routerChange(data.eventInfo);
            break;
          default:
            break;
        }
      } catch (err) {}
    });

    /**AE内部路由跳转 */
    this.routerChangeSubscribtion = this.appService.missionRouterChange$.subscribe(data => {
      this.isIframe = data.isIframe;
      if (data.newRouter) {
        this.router.navigate([data.newRouter]);
      }

      if (data.menuUrl) {
        this.routerUrl = data.menuUrl;
      }
      if (data.url) {
        this.menuChange({ resourceUri: data.url }, true);
      }
    });

    NzOptionContainerComponent.prototype.dropDownScroll = function(e, ul) {
      e.preventDefault();
      e.stopPropagation();

      let count = ul.scrollHeight - ul.scrollTop - ul.clientHeight;
      if (ul && Math.abs(count) < 2) {
        if (that.timeoutHandler) {
          clearTimeout(that.timeoutHandler);
        }
        that.timeoutHandler = setTimeout(() => {
          this.nzScrollToBottom.emit();
        }, 100);
      }
    };

    const _that = this;

    // 点击浏览器前进和后退按钮时处理abc
    window.addEventListener('popstate', function(a?) {
      // 没有历史数据不做处理
      if (!history.state) {
        return;
      }

      // 根据历史状态key，找到面包屑快照，更新面包屑
      if (_that.commonService.navMap[history.state.uuid] !== null) {
        _that.commonService.navList = _that.commonService.navMap[history.state.uuid];
        sessionStorage.removeItem('currentSrc');
        sessionStorage.removeItem('menuUrl');
      }
      // 传递状态，用于路由监听事件
      _that.commonService.navHistory = history.state.uuid;
    });
  }

  ngOnInit() {
    if (sessionStorage.getItem('menuUrl')) this.menuUrl = sessionStorage.getItem('menuUrl');

    this.listenerRouterChange();

    // 针对iframe=true刷新浏览器
    if (localStorage.getItem('productId')) {
      let src = sessionStorage.getItem('currentSrc');
      src && this.menuChange({ resourceUri: src }, true);
    }

    this.listenerWindownResize();
  }

  queryPostMessage(eventInfo) {
    let res = getMessage(eventInfo);
    if (this.isIframe) {
      document.getElementById('main-frame')['contentWindow'].postMessage(JSON.stringify(res), '*');
    }
  }

  calContainerStyle(): void {
    // setTimeout(() => {
    // this._containerStyle = {
    // height: window.innerHeight + 'px',
    // overflow: 'auto'
    // };
    // }, 200);
  }

  listenerWindownResize() {
    this.calContainerStyle();
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(event => {
        this.calContainerStyle();
      });
  }

  getSysConfigs() {
    this.authService.getRemoteToken().then(() => {
      this.curdService.getSysParam().subscribe(res => {
        if (res['code'] == 200) {
          var data = res['data'] || {};
          localStorage.setItem('analytics_custom_report_url', data['analytics.custom.report.url']);
          localStorage.setItem('my_report_url', data['my.report.url']);
          localStorage.setItem('share_report_url', data['share.report.url']);
          localStorage.setItem('user_group_report_url', data['user.group.report.url']);
          localStorage.setItem('user_manage_report_url', data['user.manage.report.url']);
        }
      });
      // 取user,小程序等数据
      this.curdService.getPortalAppConfig().subscribe((res: any) => {
        if (res.user && Object.keys(res.user).length) {
          window.localStorage.setItem('user', JSON.stringify(res.user));
        } else {
          window.localStorage.removeItem('user');
        }
        if (res && res.incrementApps) {
          localStorage.setItem('transfer', JSON.stringify(res.incrementApps));
        } else {
          window.localStorage.removeItem('transfer');
        }

        //title
        if (res && res.pageSetting && res.pageSetting.title) {
          document.title = res.pageSetting.title;
        } else {
          document.title = '运营分析平台';
        }
      });
      this.curdService.getIsVisitor().subscribe((response: any) => {
        if (response && response.data) {
          localStorage.setItem('IsVisitor', response.data.isVisitor);
        } else {
          localStorage.setItem('IsVisitor', '');
        }
      });
    });
  }

  ngOnDestroy() {
    this.routerChangeSubscribtion.unSubscribe();
  }
}
