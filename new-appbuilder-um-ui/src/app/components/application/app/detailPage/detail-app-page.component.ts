import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { DetailAppPageService } from './detail-app-page.service';
import { ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
// SERVICES
import { AppCommunicationService } from '../../../../@themes/communication-service/app-communication.service';
import { applicationTreeComponent } from '../applicationTree/applicationTree.component';

@Component({
    selector: 'detail-app-page',
    templateUrl: './detail-app-page.component.html',
    styleUrls: ['./detail-app-page.component.css'],
    providers: [DetailAppPageService]
})

export class DetailAppPageComponent implements OnInit {
    @ViewChild('treeChild')
    treeChild: applicationTreeComponent;
    inport = false;
    cancelInport = false;
    export = false;
    functionFieldArray: any[];
    licencesFieldArray: any[];
    additionalAppsFieldArray: any[];
    functionTableFieldParams: any;
    licencesTableFieldParams: any;
    additionalAppsTableFieldParams: any;
    isReloadFunctionTable = false;
    isShowEditAppModal = false;
    isShowImportActionModal = false;
    isShowExportActionModal = false;
    id: number;
    app: any;
    appAttributeParams: any = {};
    appExtend: any = {};
    appCode: any = '';
    tabs = [
        {
            name: '功能',
            tabCode: '1'
        },
        {
            name: '功能类别',
            tabCode: '2'
        },
        {
            name: '依赖的主应用',
            tabCode: '3'
        },
        {
            name: '关联许可证',
            tabCode: '4'
        }
    ];



    // 数据回调
    public refresh: EventEmitter<any> = new EventEmitter();
    public refreshAdditional: EventEmitter<any> = new EventEmitter();

    constructor(private service: DetailAppPageService, private route: ActivatedRoute, private appComService: AppCommunicationService) {
        // 监听tree点击事件，展示detail列表
        // this.showDetailSubscription = service.showDetailSwitch$.subscribe((show : any) =>{
        //     this.showDetail = show;
        // });
    }

    onSearchFunctionList(params: any) {
        this.functionTableFieldParams = params;
    }

    onSearchLicencesList(params: any) {
        this.licencesTableFieldParams = params;
    }

    onSearchAdditionalAppsList(params: any) {
        this.additionalAppsTableFieldParams = params;
    }

    onSearch(value: any) {
        this.additionalAppsTableFieldParams = { 'name': value };
    }

    onSearch2(value: any) {
        this.licencesTableFieldParams = { 'name': value };
    }

    initFunctionFieldArray(): void {
        this.functionFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '功能名称',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'fucTypeDicId',
            fieldLabel: '功能类别',
            fieldType: 'select',
            apiData: true,
            search: true,
            apiUrl: '/console-api/appController/queryAppAttributeListByName',
            apiParam: {},
            initValue: '',
            selectOptions: []
        }];
    }

    initLicencesFieldArray(): void {
        this.licencesFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '许可证名称',
            fieldType: 'input'
        }];
    }

    initAdditionalAppsFieldArray(): void {
        this.additionalAppsFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '应用名称',
            fieldType: 'input'
        }];
    }

    ngOnInit() {
        this.initFunctionFieldArray();
        this.initLicencesFieldArray();
        this.initAdditionalAppsFieldArray();
        this.id = this.route.snapshot.params['id'];
        this.appAttributeParams.id = this.id;
        this.appExtend.id = this.id;
        this.functionFieldArray[1].apiParam.id = this.id;
        this.reflashAppDetail();
    }

    showEditAppModal() {
        this.isShowEditAppModal = true;
        if (this.app.type == '2') {
            // 查询关联的主应用
            this.getAdditionApp();
        }
    }

    getAdditionApp() {

    }

    hideEditAppModal() {
        this.isShowEditAppModal = false;
        this.reflashAppDetail();
    }

    showImportActionModal() {
        this.cancelInport = false;
        this.inport = false;
        this.isShowImportActionModal = true;
    }

    hideImportActionModal(params: any) {
        this.isShowImportActionModal = false;
        // this.functionTableFieldParams = {};
    }

    submitImportActionModal(params: any) {
        this.isShowImportActionModal = false;
        this.functionTableFieldParams = {};
        this.treeChild.reset();
    }

    showExportActionModal() {
        this.isShowExportActionModal = true;
    }

    hideExportActionModal(params: any) {
        // this.export = !this.export;
        this.isShowExportActionModal = false;
    }

    handleOkEx(e: any) {
        const that = this;
        console.log(that.export);
        that.export = !that.export;
    }

    // 切换tab,如果是切换到“功能”板块，刷新页面,用于nz-tabset的nzSelectChange事件
    refreshTab(e: any) {
        if (e.index == 0) {
            this.treeChild.reset();
        }

    }
    // 导入提交
    handleOk = (e: any) => {
        // this.isShowImportActionModal = false;
        this.inport = true;
    }
    closeInport() {
        this.isShowImportActionModal = false;
    }
    // 导入弹框 取消
    handleCancel = (e: any) => {
        this.closeInport();
        this.cancelInport = true;

    }
    reflashAppDetail() {
        this.refreshAdditional.emit();
        this.service.getAppPageDetail(this.id).subscribe((data: any) => {
            if (data.success == '200') {
                this.app = data.result;

                // 发布appName
                this.appComService.setAppName(this.app.name);

                if (this.app) {
                    this.appCode = this.app.code;
                    const type = this.app.type;
                    if (type == 1) {
                        this.tabs = [
                            {
                                name: '功能',
                                tabCode: '1'
                            },
                            {
                                name: '功能类别',
                                tabCode: '2'
                            },
                            {
                                name: '关联许可证',
                                tabCode: '4'
                            },
                            //   {
                            //     name: '属性扩展',
                            //     tabCode: '5'
                            //   }
                        ];
                    }
                    if (type == 2) {
                        this.tabs = [
                            {
                                name: '功能',
                                tabCode: '1'
                            },
                            {
                                name: '功能类别',
                                tabCode: '2'
                            },
                            {
                                name: '依赖的主应用',
                                tabCode: '3'
                            },
                            {
                                name: '关联许可证',
                                tabCode: '4'
                            },
                            // {
                            //   name: '属性扩展',
                            //   tabCode: '5'
                            // }
                        ];
                    }
                }
            }
        });
    }


    /**
     * 类别页数据修改功能页部分数据刷新
     * @return {[type]} [description]
     */
    public onRefresh(e: any) {
        if (this.treeChild) {
            this.treeChild.freshType();
        }
    }

}

