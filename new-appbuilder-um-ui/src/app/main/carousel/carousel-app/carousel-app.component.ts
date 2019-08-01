import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CarouselAppService } from './carousel-app.service';

@Component({
    selector: 'carousel-app',
    templateUrl: './carousel-app.component.html',
    styleUrls: ['./carousel-app.component.css']
})
export class CarouselAppComponent implements OnInit, OnDestroy {
    appList: any[] = [];
    isCollapse = true;
    curApp: any = {};
    resourceTreeDatas: any[] = [];
    isSetTreeDatas: boolean = false;
    constructor(private service: CarouselAppService) {

    }

    toggleCollapse() {
        this.isCollapse = !this.isCollapse;;
    }

    queryAppList() {
        this.appList = [{
            id: 1,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 2,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 3,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 4,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 5,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 6,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 7,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 8,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 9,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 10,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }, {
            id: 11,
            code: 'dmp',
            name: '用户运营平台',
            icon: '../../../../assets/images/app/logo/yhgj.png'
        }];
        this.initCurApp();
    }

    queryResourceTreeDatasByApp() {
        this.resourceTreeDatas = [{
            id: 1,
            label: '产品中心',
            isTree: false,
            children: [{
                id: 11,
                label: 'MoneyBox',
                children: [],
                checked: true
            }, {
                id: 12,
                label: '标签体系',
                children: []
            }]
        }, {
            id: 2,
            label: '按钮',
            isTree: false,
            children: [{
                id: 21,
                label: '产品管理权限',
                children: []
            }, {
                id: 22,
                label: '报表配置',
                children: []
            }]
        }, {
            id: 3,
            label: '菜单',
            isTree: true,
            children: [{
                id: 31,
                label: '移动分析',
                children: [{
                    id: 311,
                    label: '数据概览',
                    children: []
                }, {
                    id: 312,
                    label: '运营分析',
                    children: [{
                        id: 3121,
                        label: '渠道分析',
                        children: []
                    }, {
                        id: 3122,
                        label: '用户留存',
                        children: []
                    }, {
                        id: 3123,
                        label: '活跃分析',
                        children: []
                    }]
                }]
            }, {
                id: 32,
                label: 'WEB分析',
                children: [{
                    id: 321,
                    label: '数据概览',
                    children: []
                }, {
                    id: 322,
                    label: '运营分析',
                    children: [{
                        id: 3221,
                        label: '渠道分析',
                        children: []
                    }, {
                        id: 3222,
                        label: '用户留存',
                        children: []
                    }, {
                        id: 3223,
                        label: '活跃分析',
                        children: []
                    }]
                }]
            }, {
                id: 33,
                label: '跨屏分析',
                children: [{
                    id: 331,
                    label: '数据概览',
                    children: []
                }, {
                    id: 332,
                    label: '运营分析',
                    children: [{
                        id: 3321,
                        label: '渠道分析',
                        children: []
                    }, {
                        id: 3322,
                        label: '用户留存',
                        children: []
                    }, {
                        id: 3323,
                        label: '活跃分析',
                        children: []
                    }]
                }]
            }]
        }];
    }

    initCurApp() {
        if (this.appList && this.appList.length > 0) {
            this.appList[0].active = true;
            this.curApp = this.appList[0];
            this.isSetTreeDatas = false;
            this.queryResourceTreeDatasByApp();
        }
    }

    resetCurApp(app: any) {
        if (this.appList && this.appList.length > 0) {
            for (let i = 0; i < this.appList.length; i++) {
                this.appList[i].active = false;
            }
        }
        app.active = true;
        this.curApp = app;
        this.queryResourceTreeDatasByApp();
    }

    checkAppIsActive(app: any) {
        let isActive: boolean = false;
        if (app && this.appList && this.appList.length > 0) {
            for (let i = 0; i < this.appList.length; i++) {
                if (this.appList[i].active && app.id == this.appList[i].id) {
                    isActive = true;
                    break;
                }
            }
        }
        return isActive;
    }

    calcelEditAllApp() {
        if (this.appList && this.appList.length > 0) {
            for (let i = 0; i < this.appList.length; i++) {
                this.appList[i].isEdit = false;
            }
        }
    }

    editApp(app: any) {
        this.calcelEditAllApp();
        app.isEdit = false;
        this.resetCurApp(app);
        this.isSetTreeDatas = false;
        /*if(this.checkAppIsActive(app)){
            return false;
        }*/
    }

    cancelEditApp(app: any) {
        app.isEdit = false;
        this.isSetTreeDatas = false;
    }

    setApp(app: any) {
        this.calcelEditAllApp();
        app.isEdit = true;
        this.resetCurApp(app);
        this.isSetTreeDatas = true;
    }

    deleteApp(app: any) {

    }

    saveApp(app: any) {
        this.cancelEditApp(app);
    }

    getBackTreeDatas(datas: any[]) {

    }

    ngOnInit() {
        this.queryAppList();
    }

    ngOnDestroy() {

    }

}