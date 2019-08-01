import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {CommonService} from './common/services/common.service';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {debounceTime} from 'rxjs/operators/debounceTime';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    title = 'app';

    firstLevelMap: any = {
        '/product-center': 0, // '产品中心',

        '/business-overview/my-report': 1, // '我的报表',
        '/business-overview/sharing-report': 1, // '共享的报表',
        '/business-overview/marketing-plan': 1, // '营销计划',

        '/basic-analysis/user-retention': 1, // '留存分析',
        '/basic-analysis/behavior-analysis': 1, // '行为分析',
        '/basic-analysis/custom-analysis': 1, // '自定义分析',

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
        '/scene-insight/trans-funnel/list': 1, // '转化漏斗', // --child
        '/scene-insight/advanced-trans-funnel/list': 1, // '高级转化漏斗', // --child
        '/scene-insight/capacity-path/list': 1, // '智能路径', // --child

        '/marketing/activity-center': 1, // 1, // 活动管理

        '/manage/manage-system': 1, // '系统管理',
        '/manage/user-configured': 1, // '用户配置',
        '/manage/marketing-manage': 1, // '营销管理',
        '/manage/manage-system/event-mgt': 1, // '系统管理', // --child
        '/manage/manage-system/user-click-map': 1, // '系统管理', // --child
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
    };

    urlMap: any = {
        '/product-center': '产品中心',

        '/business-overview/my-report': '我的报表',
        '/business-overview/sharing-report': '共享的报表',
        '/business-overview/marketing-plan': '营销计划',

        '/basic-analysis/user-retention': '留存分析',
        '/basic-analysis/behavior-analysis': '行为分析',
        '/basic-analysis/custom-analysis': '自定义分析',

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
        '/scene-insight/trans-funnel/list': '转化漏斗', // --child
        '/scene-insight/advanced-trans-funnel/list': '高级转化漏斗', // --child
        '/scene-insight/capacity-path/list': '智能路径', // --child

        '/marketing/activity-center': '活动管理',

        '/manage/manage-system': '系统管理',
        '/manage/user-configured': '用户配置',
        '/manage/marketing-manage': '营销管理',
        '/manage/manage-system/event-mgt': '系统管理', // --child
        '/manage/manage-system/user-click-map': '系统管理', // --child
        '/manage/user-configured/crowd': '用户配置', // --child
        '/manage/marketing-manage/crowd-manage': '营销管理', // --child
        '/manage/process-manage': '营销流程管理',
        '/manage/apply-manage': '推送配置',
        '/manage/apply-manage/app-push': '推送配置', // --child
        '/manage/app-push-manage': '推送配置', // --tmp

        '/download': '数据下载',
        '/download-data': '数据下载',

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

        // -------------以下待整理-----------------

        '/crowd-export': '导出',
        '/marketing-activities/activities': '活动详情',
        '/effect-report/report': '效果报告',
        '/pipeline': '营销流程',

        '/nautilus/train': '测试页面',

    };

    constructor(private router: Router,
                private commonService: CommonService) {
        this.listenerRouterChange();
        this.listenerWindownResize();
        // this.commonService.initReportUrl();

        const _that = this;

        // 点击浏览器前进和后退按钮时处理abc
        window.addEventListener('popstate', function (a?) {

            // 没有历史数据不做处理
            if (!history.state) {
                return;
            }

            // 根据历史状态key，找到面包屑快照，更新面包屑
            if (_that.commonService.navMap[history.state.uuid] !== null) {
                _that.commonService.navList = _that.commonService.navMap[history.state.uuid];
            }
            // 传递状态，用于路由监听事件
            _that.commonService.navHistory = history.state.uuid;

        });

    }

    listenerRouterChange() {
        const _that = this;
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {

                // 若历史监听更新了面包屑，将key放到新的历史状态里
                if (_that.commonService.navHistory) {
                    history.replaceState({uuid: _that.commonService.navHistory}, 'historyTitle');
                    _that.commonService.navHistory = null;
                    return;
                }

                // 用于映射中文
                const url_min = event.url.split('#')[0].split('?')[0].split(';')[0];
                const url2 = event.url.split('#')[0].split('?')[0];

                // 一级页面，清空导航列表
                if (this.firstLevelMap[url_min] === 1) {
                    _that.commonService.navList = [];
                }

                const currentLevel = _that.firstLevelMap[url_min] !== undefined ? _that.firstLevelMap[url_min] : 1;
                const uuid = new Date().toISOString();
                const navObj = {
                    name: _that.urlMap[url_min] || '未知名称',
                    url: event.url,
                    level: currentLevel,
                };

//                _that.commonService.navCurrent = navObj;

                if (!_that.commonService.navList) {
                    _that.commonService.navList = [];
                }

                const navListTmp = [];
                for (let i = 0; i < _that.commonService.navList.length; i++) {
                    const obj = _that.commonService.navList[i];
                    if (obj.level <= currentLevel) {
                        navListTmp.push(obj);
                    }
                }
                _that.commonService.navList = navListTmp;

                if (_that.urlMap[url_min]) {
                    if (_that.commonService.navList.length > 0) {
                        const obj = _that.commonService.navList[_that.commonService.navList.length - 1];
                        const url3 = obj.url.split('#')[0].split('?')[0];
                        if (url2 !== url3) {
                            _that.commonService.navList.push(navObj);
                        }
                    } else {
                        _that.commonService.navList.push(navObj);
                    }
                }

                const navListClone = JSON.parse(JSON.stringify(_that.commonService.navList));
                _that.commonService.navMap[uuid] = navListClone;
                history.replaceState({uuid: uuid}, 'historyTitle');
            }
        });
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
        fromEvent(window, 'resize').pipe(
            debounceTime(100)
        ).subscribe((event) => {
            this.calContainerStyle();
        });
    }
}
