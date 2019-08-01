import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { saveMessage } from './utils/post-message';
import { CommonService } from './common/services/common.service';

export class AppConfig {
  menuUrl: string; // 当前选中菜单
  routerUrl: string; // 当前页的路由
  iframe_src: SafeResourceUrl; // 嵌入iframe页面
  isIframe: boolean = false; // iframe页面
  _frameTimer: any;

  title = 'app';
  appCode = 'AEPLUS';
  timeoutHandler: any;
  routerChangeSubscribtion: any;

  isLoaded = false;

  firstLevelMap: any = {
    '/product-center': 0, // '产品中心',

    '/business-overview/my-report': 1, // '我的报表',
    '/business-overview/sharing-report': 1, // '共享的报表',
    '/business-overview/marketing-plan': 1, // '营销计划',

    '/basic-analysis/user-retention': 1, // '留存分析',
    '/basic-analysis/behavior-analysis': 1, // '事件分析',
    '/basic-analysis/event-analysis': 1, // '事件分析',
    '/basic-analysis/custom-analysis': 1, // '自定义看板',
    '/basic-analysis/use-analysis': 1, // '使用分析',

    '/page-analysis/page-path': 1, // '页面路径',
    '/page-analysis/page-heatmap': 1, // '页面热力图',
    '/page-analysis/page-path/page-path-app': 1, // '页面路径', // --child
    '/page-analysis/page-heatmap/page-heatmap-h5': 1, // '页面热力图', // --child

    '/user/user-group': 1, // '用户分群',
    '/user/user-insight': 1, // '用户洞察',
    '/user/position-analysis': 1, // '位置分析',

    '/scene-insight/trans-funnel': 1, // '转化漏斗',
    '/scene-insight/advanced-trans-funnel': 1, // '高级转化漏斗',
    '/scene-insight/capacity-path': 1, // '智能路径',

    '/marketing/activity-center': 1, // 1, // 活动管理
    '/early-warning': 1, // 1, // 业务预警
    '/early-warning/warning-rule': 1, // 1, // 预警规则
    '/early-warning/warning-history': 1, // 1, // 告警历史
    '/add-warning-rules': 2, // '新建预警规则',

    '/warning-rules-view': 2, // '查看预警规则',

    '/manage/manage-system': 1, // '系统管理',
    '/manage/user-configured': 1, // '用户配置',
    '/manage/marketing-manage': 1, // '营销管理',
    // '/manage/manage-system/event-mgt': 1, // '系统管理', // --child
    // '/manage/manage-system/user-click-map': 1, // '系统管理', // --child
    '/manage/user-configured/crowd': 1, // '用户配置', // --child
    '/manage/marketing-manage/crowd-manage': 1, // '营销管理', // --child
    '/manage/process-manage': 1, // '营销流程管理',
    '/manage/apply-manage': 1, // '推送配置',
    '/manage/apply-manage/app-push': 1, // '推送配置', // --child
    '/manage/app-push-manage': 1, // '推送配置', // --tmp

    '/download': 1, // '数据下载',
    '/download-data': 1, // '数据下载',

    // ------------------------
    '/marketing-activities/activities': 2, // 活动详情
    '/effect-report/report': 3, // 效果报告
    '/pipeline': 3, // 营销流程

    '/app-error': 1, // APP错误分析
    /*******/
    '/subcontract-channels': 1, // '分包渠道分析',
    '/traffic-sources': 1 // '流量来源分析',
  };

  urlMap: any = {
    '/product-center': '产品中心',

    '/business-overview/my-report': '我的报表',
    '/business-overview/sharing-report': '共享的报表',
    '/business-overview/marketing-plan': '营销计划',

    '/basic-analysis/user-retention': '留存分析',
    '/basic-analysis/behavior-analysis': '事件分析',
    '/basic-analysis/event-analysis': '事件分析',
    '/basic-analysis/custom-analysis': '自定义看板',
    '/basic-analysis/use-analysis': '使用分析',

    '/page-analysis/page-path': '页面路径',
    '/page-analysis/page-heatmap': '页面热力图',
    '/page-analysis/page-path/page-path-app': '页面路径', // --child
    '/page-analysis/page-heatmap/page-heatmap-h5': '页面热力图', // --child

    '/user/user-group': '用户分群',
    '/user/user-insight': '用户洞察',
    '/user/position-analysis': '位置分析',

    '/scene-insight/trans-funnel': '转化漏斗',
    '/scene-insight/advanced-trans-funnel': '高级转化漏斗',
    '/scene-insight/capacity-path': '智能路径',

    '/marketing/activity-center': '活动管理',
    '/early-warning': '业务预警', // 1, // 业务预警
    '/early-warning/warning-rule': '业务预警', // --child
    '/early-warning/warning-history': '业务预警', // --child
    '/add-warning-rules': '新建预警规则',
    '/warning-rules-view': '查看预警规则',

    '/manage/manage-system': '系统管理',
    '/manage/user-configured': '用户配置',
    '/manage/marketing-manage': '营销管理',
    // '/manage/manage-system/event-mgt': '系统管理', // --child
    // '/manage/manage-system/user-click-map': '系统管理', // --child
    '/manage/user-configured/crowd': '用户配置', // --child
    '/manage/marketing-manage/crowd-manage': '营销管理', // --child
    '/manage/process-manage': '营销流程管理',
    '/manage/apply-manage': '推送配置',
    '/manage/apply-manage/app-push': '推送配置', // --child
    '/manage/app-push-manage': '推送配置', // --tmp

    '/download': '数据下载',
    '/download-data': '数据下载',
    '/data-search': '数据查询',

    '/subcontract-channels': '分包渠道分析', // '分包渠道分析',
    '/traffic-sources': '流量来源分析', // '流量来源分析',
    // -------------一级页面分割线-----------------
    '/scene-insight/trans-funnel/view': '查看漏斗',
    '/scene-insight/trans-funnel/edit': '编辑漏斗',
    '/scene-insight/trans-funnel/add': '添加漏斗',

    '/scene-insight/advanced-trans-funnel/view': '查看漏斗',
    '/scene-insight/advanced-trans-funnel/edit': '编辑漏斗',
    '/scene-insight/advanced-trans-funnel/add': '添加漏斗',
    '/scene-insight/advanced-trans-funnel/users': '用户列表',

    '/scene-insight/capacity-path/view': '查看智能路径',
    '/scene-insight/capacity-path/edit': '编辑智能路径',
    '/scene-insight/capacity-path/add': '添加智能路径',

    '/crowd-create/view': '查看用户分群',
    '/crowd-create/edit': '编辑用户分群',
    '/crowd-create/add': '新建用户分群',
    '/crowd-create/createChild': '创建子人群',

    '/user/user-insight/list': '用户列表',
    '/user/user-profile': '用户档案',
    '/user/user-group/child': '子人群列表',
    '/user/user-group/insights': '画像',

    '/manage/user-configured/tag/tag-create/add': '添加标签',
    '/manage/user-configured/tag/tag-create/edit': '编辑标签',
    '/manage/user-configured/tag/tag-create/view': '查看标签',

    '/app-error': 'APP错误分析', // APP错误分析
    '/app-error/detail': '错误详情',

    '/subcontract-channels/list': '渠道详情',
    '/traffic-sources/list': '流量来源分析详情',

    '/basic-analysis/event-analysis-detail': '事件详情',
    // -------------以下待整理-----------------

    '/crowd-export': '导出',
    '/marketing-activities/activities': '活动详情',
    '/effect-report/report': '效果报告',
    '/pipeline': '营销流程'
  };

  constructor(public commonService: CommonService, public router: Router, public domSanitizer: DomSanitizer) {}
  /**
   * 由报表跳转到AE
   */
  routerChange(eventInfo: any) {
    if (!eventInfo || !eventInfo.data) {
      return;
    }
    let reportData = null,
      reportUrl = null;

    // 缓存跳转后面包屑等信息
    eventInfo.data.data && saveMessage({ data: eventInfo.data.data });

    switch (eventInfo.data.router) {
      case 'report': // 我的报表
        reportData = localStorage.getItem('report') && JSON.parse(localStorage.getItem('report'));
        reportUrl = reportData.report.url;
        break;

      case 'dmp': // 用户配置报表
        reportData = localStorage.getItem('dmp') && JSON.parse(localStorage.getItem('dmp'));
        reportUrl = reportData.dmp.url;
        break;

      case 'customReport': // 自定义分析报表
        reportData = localStorage.getItem('customReport') && JSON.parse(localStorage.getItem('customReport'));
        reportUrl = reportData.customReport.url;
        break;
      default:
        break;
    }
    this.isIframe = false;
    this.iframe_src = '';
    sessionStorage.removeItem('currentSrc');

    if (typeof eventInfo.data === 'string' && eventInfo.data.indexOf('download-data') >= 0) {
      // 下载
      this.commonService.goPage('/download-data');
    } else {
      reportUrl && this.router.navigateByUrl(decodeURIComponent(reportUrl).split('#')[1]);
    }
  }

  /**
   * 监听路由变化
   */
  listenerRouterChange() {
    const _that = this;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url == '/' || (!localStorage.getItem('productId') && event.url.indexOf('product-center') < 0)) {
          // 处理路由重定向到产品中心的问题
          this.menuUrl = null;
          this.gotoProduct();
        }
        if (event.url && event.url.indexOf('studio') < 0) {
          this.isIframe = false;
        }
      }
      if (event instanceof NavigationEnd) {
        this.routerUrl = event.url;
        if (event.url.indexOf('product-center') >= 0) {
          sessionStorage.removeItem('currentSrc');
          sessionStorage.removeItem('menuUrl');
          this.commonService.navList = [];
        }

        // 处在子路由页面刷新，处理选中菜单
        if (this.firstLevelMap[event.url]) {
          this.menuUrl = event.url;
        } else if (event.url.indexOf('manage/manage-system') >= 0) {
          this.menuUrl = '/manage/manage-system';
          sessionStorage.setItem('menuUrl', this.menuUrl);
          this.commonService.navList = [
            {
              name: this.urlMap[this.menuUrl],
              url: this.menuUrl,
              level: this.firstLevelMap[this.menuUrl]
            }
          ];
        }

        // 处在一级菜单嵌入报表页刷新，处理选中菜单
        if (this.firstLevelMap[event.url] && !this.commonService.navHistory) {
          this.menuUrl = sessionStorage.getItem('menuUrl');
        }

        // 若历史监听更新了面包屑，将key放到新的历史状态里
        if (_that.commonService.navHistory) {
          history.replaceState({ uuid: _that.commonService.navHistory }, 'historyTitle');
          _that.commonService.navHistory = null;
          this.updateNavlist(event, false);
          return;
        }

        const url2 = event.url.split('#')[0].split('?')[0];

        if (url2.indexOf('/scene-insight/trans-funnel') === -1) {
          localStorage.removeItem('trans_funnel_tab');
        }
        if (url2.indexOf('/scene-insight/advanced-trans-funnel') === -1) {
          localStorage.removeItem('advanced_trans_funnel_tab');
        }
        if (url2.indexOf('/scene-insight/capacity-path') === -1) {
          localStorage.removeItem('capacity_path_tab');
        }
        if (url2.indexOf('user/user-insight') === -1 && url2.indexOf('user/user-profile') === -1) {
          localStorage.removeItem('userInsight');
          localStorage.removeItem('userList');
        }
        if (
          url2.indexOf('basic-analysis/behavior-analysis') === -1 &&
          url2.indexOf('/scene-insight/advanced-trans-funnel') === -1 &&
          url2.indexOf('/user/user-profile') === -1
        ) {
          localStorage.removeItem('crowdFilter');
        }

        if (url2.indexOf('user-configured') < 0) {
          localStorage.removeItem('dmp');
        }

        if (url2.indexOf('custom-analysis') < 0) {
          localStorage.removeItem('customReport');
        }

        if (url2.indexOf('business-overview/studio') < 0) {
          localStorage.removeItem('report');
        }
        this.updateNavlist(event, true);
      }
    });
  }

  /**
   * 更新导航和浏览器历史记录
   */
  updateNavlist(event: any, updateHistory: boolean) {
    // 用于映射中文
    const url_min = event.url
      .split('#')[0]
      .split('?')[0]
      .split(';')[0];
    const url2 = event.url
      .split('#')[0]
      .split('?')[0]
      .split(';')[0];

    if (
      this.firstLevelMap[url_min] !== 1 &&
      this.firstLevelMap[url_min] !== 0 &&
      history.state &&
      history.state.navigationId <= 1
    ) {
      this.commonService.navList = localStorage.getItem('navList') && JSON.parse(localStorage.getItem('navList'));
      this.menuUrl =
        (this.commonService.navList && this.commonService.navList[0] && this.commonService.navList[0]['url']) ||
        sessionStorage.getItem('menuUrl');
    }

    const currentLevel = this.firstLevelMap[url_min] !== undefined ? this.firstLevelMap[url_min] : 1;
    const uuid = new Date().toISOString();
    const navObj = {
      name: this.urlMap[url_min] || '未知名称',
      url: event.url,
      level: currentLevel
    };

    if (!this.commonService.navList) {
      this.commonService.navList = [];
    }

    const navListTmp = [];
    for (let i = 0; i < this.commonService.navList.length; i++) {
      const obj = this.commonService.navList[i];
      if (obj.level <= currentLevel) {
        navListTmp.push(obj);
      }
    }
    this.commonService.navList = navListTmp;

    if (this.urlMap[url_min]) {
      if (this.commonService.navList.length > 0) {
        const obj = this.commonService.navList[this.commonService.navList.length - 1];
        const url3 = obj.url.split(';')[0];
        if (url2 !== url3) {
          this.commonService.navList.push(navObj);
        }
      } else {
        this.commonService.navList.push(navObj);
      }
    }
    localStorage.setItem('navList', JSON.stringify(this.commonService.navList));
    const navListClone = JSON.parse(JSON.stringify(this.commonService.navList));
    if (updateHistory) {
      this.commonService.navMap[uuid] = navListClone;
      history.replaceState({ uuid: uuid }, 'historyTitle');
    }
  }

  /**
   * 点击菜单
   * @param event
   */
  menuChange(event: any, notClick?: boolean) {
    (document.querySelector('.loading') as HTMLElement).style.display = 'none';
    if (event['resourceUri']) {
      !notClick && sessionStorage.removeItem('navList');
      !notClick && (this.commonService.navList = []);
      this.menuUrl = null;

      let urls = event['resourceUri'].split('#');
      this.iframe_src = null;
      this.isIframe = false;
      if (urls.length <= 1) {
        sessionStorage.removeItem('currentSrc');
        this.router.navigate([urls[0]]);
      } else {
        setTimeout(() => {
          this.isIframe = true;
        }, 1);
        !notClick && this.router.navigate(['/studio-analysis']);

        const src = notClick
          ? event['resourceUri']
          : `${event['resourceUri']}?product_id=${localStorage.getItem('productId')}&appkey=${localStorage.getItem(
              'appkey'
            )}&token=${localStorage.getItem('token')}`;
        this.commonService.navList = [];
        localStorage.removeItem('navList');
        sessionStorage.setItem('currentSrc', src);

        this.iframe_src = this.domSanitizer.bypassSecurityTrustResourceUrl(src);
        clearTimeout(this._frameTimer);
        (document.querySelector('.loading') as HTMLElement).style.display = 'block';
        const that = this;
        that._frameTimer = setTimeout(function() {
          if (document.getElementById('main-frame')) {
            document.getElementById('main-frame').onload = function() {
              that._frameTimer = null;
              (document.querySelector('.loading') as HTMLElement).style.display = 'none';
            };
          }
        }, 20);
      }
    }
  }

  /**
   * 返回产品中心
   */
  gotoProduct() {
    this.iframe_src = '';
    this.isIframe = false;
    sessionStorage.removeItem('currentSrc');
    sessionStorage.removeItem('menuUrl');
    this.commonService.navList = [];
    if (location.href.indexOf('product-center') < 0) {
      // 跳回产品中心
      this.router.navigate(['product-center']);
      this.routerUrl = 'product-center';
    } else {
      // 跳回portal产品列表
      const href = `${location.origin}/portal`;
      window.location.href = href;
    }
  }
}
