import { Component, OnInit, OnDestroy } from '@angular/core';
import { UgUsersService } from './ugusers.service';
import { NzModalService } from 'ng-cosmos-ui';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ugusers',
    templateUrl: './ugusers.component.html',
    styleUrls: ['./ugusers.component.css']
})
export class UgUsersComponent implements OnInit, OnDestroy {
    uguserFieldArray: any[];
    uguserTableFieldParams: any;
    uguserTableAjaxUrl: string;
    isShowAddUerModal: boolean = false;
    isReloadUserTable: boolean = false;
    tenantId: number = 0;

    constructor(private activeRoute: ActivatedRoute, private service: UgUsersService, private confirmServ: NzModalService) {
        this.uguserTableAjaxUrl = service.getUgUsersUrl;
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
        this.uguserTableFieldParams = params;
    }

    initUserFieldArray(): void {
        this.uguserFieldArray = [{
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
        }, {
            id: 3,
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
        }];
    }

    ngOnInit() {
        if (this.activeRoute.snapshot.params['tenantId'] != null) {
            this.tenantId = this.activeRoute.snapshot.params['tenantId'];
        } else if (window['appConfig'] && window['appConfig'].tenant) {
            this.tenantId = window['appConfig'].tenant.id;
        } else {
            this.tenantId = 0;
        }
        this.initUserFieldArray();
    }

    ngOnDestroy() {

    }

}
