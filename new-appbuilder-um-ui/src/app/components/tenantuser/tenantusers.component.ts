 import { Component, OnInit, OnDestroy } from '@angular/core';
import { TenantusersService } from './tenantusers.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ActivatedRoute } from "@angular/router";
import { AppService } from "./../../app.service";

@Component({
    selector: 'tenantusers',
    templateUrl: './tenantusers.component.html',
    styleUrls: ['./tenantusers.component.css']
})
export class TenantusersComponent implements OnInit, OnDestroy {
    userFieldArray: any[];
    userTableFieldParams: any;
    userTableAjaxUrl: string;
    isShowAddUerModal: boolean = false;
    isReloadUserTable: boolean = false;
    tenantId: number = 0;

    constructor(private service: TenantusersService, private activeRoute: ActivatedRoute, private confirmServ: NzModalService, private appService: AppService,
    ) {
        this.userTableAjaxUrl = service.getUsersUrl;
    }

    showConfirm() {
        this.confirmServ.confirm({
            nzTitle: '您是否确认要删除这项内容',
            nzContent: '<strong>一些解释</strong>',
            nzOnOk: () => {
                console.log('确定');
            },
            nzOnCancel: () => {
            }
        });
    }

    showInfo() {
        this.confirmServ.info({
            nzTitle: '这是一条通知信息',
            nzContent: '信息内容'
        });
    }

    showAddUserModal() {
        this.isReloadUserTable = false;
        this.isShowAddUerModal = true;
    }

    hideAddUserModal(params: any) {
        this.isShowAddUerModal = false;
    }

    onSubmitUserFormData(params: boolean) {
        this.isReloadUserTable = params || false;
    }

    onSearchUserList(params: any) {
        this.userTableFieldParams = params;
    }

    initUserFieldArray(): void {
        this.userFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '姓名',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'email',
            fieldLabel: '账号',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'mobile',
            fieldLabel: '手机',
            fieldType: 'input'
        },
        // {
        //     id:4,
        //     fieldName:'wechat',
        //     fieldLabel:'微信',
        //     fieldType:'input'
        // },{
        //     id:5,
        //     fieldName:'qq',
        //     fieldLabel:'QQ',
        //     fieldType:'input'
        // },
        {
            id: 6,
            fieldName: 'status',
            fieldLabel: '状态',
            fieldType: 'select',
            apiData: false,
            initValue: '',
            selectOptions: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '正常'
            }, {
                value: '0',
                label: '禁用'
            }]
        }
            // ,{
            //     id:7,
            //     fieldName:'deptName',
            //     fieldLabel:'部门',
            //     fieldType:'input'
            // }
        ];
    }

    ngOnInit() {
        // {
        // setTimeout(() => {
            if (window['appConfig'] && window['appConfig'].tenant && window['appConfig'].tenant.id) {
                this.tenantId = window['appConfig'].tenant.id;
            } else if (this.activeRoute.snapshot.params['tenantId'] != null) {
                this.tenantId = this.activeRoute.snapshot.params['tenantId'];
            } else {
                this.appService.getAppConfig().then((response: any) => {
                    this.tenantId = response["user"]["tenantId"];
                }).catch((err: any) => {
                    this.tenantId = 0;
                });
            }
        // }, 500);
        // }
        console.log(this.tenantId);
        this.initUserFieldArray();
    }

    ngOnDestroy() {

    }

}