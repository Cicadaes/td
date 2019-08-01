import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TenantsAppTableService } from './tenants-app-table.service';
import { ScrollToTopService } from '../../../../../@themes/scroll-service';

@Component({
    selector: 'tenants-app-table',
    templateUrl: './tenants-app-table.component.html',
    styleUrls: ['./tenants-app-table.component.css']
})

export class TenantsAppTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() tenantId: any;
    isShowAddAppModal = false;
    currentApp: any;
    isShowAddUerModal = false;
    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    resourceTreeDatas: any[] = [];
    appId: any;
    rolecode: any;

    constructor(private scrollSer: ScrollToTopService, private service: TenantsAppTableService) {

    }


    reset() {
        this.refreshData(true);
    }

    showAddAppModal(app: any) {
        this.currentApp = app;
        this.isShowAddAppModal = true;
    }
    updateAppStatus(app: any, status: any) {
        this.currentApp = app;
        this.isShowAddAppModal = true;
    }

    hideAddAppModal(params: any) {
        this.isShowAddAppModal = false;
    }

    refreshData(reset = false) {
        this.scrollSer.scrollToTop();
        this.initrole();
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        const params = this.queryParams || {};
        params.page = this._current;
        params.rows = this._pageSize;
        params.tenantId = this.tenantId;
        this.service.getApps(params).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
        }).catch((err: any) => {
            console.log(err);
        });

    }


    ngOnChanges(changes: SimpleChanges) {
        this.queryParams = changes.queryParams.currentValue || {};
        this.reset();
    }

    showAddUserModal(data: any) {
        this.appId = data.id;
        this.isShowAddUerModal = true;
        this.queryFuncTree();
    }

    queryFuncTree() {
        // alert(this.appId+","+this.tenantId);
        this.resourceTreeDatas = [];
        const params = {
            id: this.appId,
            tenantId: this.tenantId
        };
        this.service.queryTenantAppFunc(params).then((data: any) => {
            this.resourceTreeDatas = data.result.tree;
        }).catch((err: any) => {
            console.log(err);
        });

        /*this.resourceTreeDatas = [{
            id:1,
            label:'产品中心',
            isTree:false,
            children:[{
                id:11,
                label:'MoneyBox',
                children:[],
                checked: true
            },{
                id:12,
                label:'标签体系',
                children:[]
            }]
        },{
            id:2,
            label:'按钮',
            isTree:false,
            children:[{
                id:21,
                label:'产品管理权限',
                children:[]
            },{
                id:22,
                label:'报表配置',
                children:[]
            }]
        },{
            id:3,
            label:'菜单',
            isTree:true,
            children:[{
                id:31,
                label:'移动分析',
                children:[{
                    id:311,
                    label:'数据概览',
                    children:[]
                },{
                    id:312,
                    label:'运营分析',
                    children:[{
                        id:3121,
                        label:'渠道分析',
                        children:[]
                    },{
                        id:3122,
                        label:'用户留存',
                        children:[]
                    },{
                        id:3123,
                        label:'活跃分析',
                        children:[]
                    }]
                }]
            },{
                id:32,
                label:'WEB分析',
                children:[{
                    id:321,
                    label:'数据概览',
                    children:[]
                },{
                    id:322,
                    label:'运营分析',
                    children:[{
                        id:3221,
                        label:'渠道分析',
                        children:[]
                    },{
                        id:3222,
                        label:'用户留存',
                        children:[]
                    },{
                        id:3223,
                        label:'活跃分析',
                        children:[]
                    }]
                }]
            },{
                id:33,
                label:'跨屏分析',
                children:[{
                    id:331,
                    label:'数据概览',
                    children:[]
                },{
                    id:332,
                    label:'运营分析',
                    children:[{
                        id:3321,
                        label:'渠道分析',
                        children:[]
                    },{
                        id:3322,
                        label:'用户留存',
                        children:[]
                    },{
                        id:3323,
                        label:'活跃分析',
                        children:[]
                    }]
                }]
            }]
        }];*/
    }
    hideAddUserModal(params: any) {
        this.isShowAddUerModal = false;
    }

    onSubmitUserFormData(params: boolean) {
        // this.isReloadUserTable = params || false;
    }
    ngOnInit() {
        this.initrole();

    }
    initrole() {
        this.rolecode = window['appConfig'].rolecode;
        if (this.rolecode === 'UM_TENANT_ADMIN') {
            this.tenantId = window['appConfig'].tenant.id;
        }
    }
}
