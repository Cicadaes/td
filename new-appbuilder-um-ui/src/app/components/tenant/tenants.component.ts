import { Component, OnInit, OnDestroy } from '@angular/core';
import { TenantsService } from './tenants.service';
import { NzModalService } from 'ng-cosmos-ui';
@Component({
    selector: 'app-tenants',
    templateUrl: './tenants.component.html',
    styleUrls: ['./tenants.component.css']
})
export class TenantsComponent implements OnInit, OnDestroy {
    tenantFieldArray: any[];
    tenantTableFieldParams: any;
    tenantTableAjaxUrl: string;
    isShowAddTenantModal = false;
    isReloadTenantTable = false;

    constructor(
        private service: TenantsService,
        private confirmServ: NzModalService) {
        this.tenantTableAjaxUrl = service.getTenantsUrl;
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

    showAddTenantModal() {
        this.isReloadTenantTable = false;
        this.isShowAddTenantModal = true;
    }

    hideAddTenantModal(params: any) {
        this.isShowAddTenantModal = false;
    }

    onSubmitTenantFormData(params: boolean) {
        this.isReloadTenantTable = params || false;
    }

    onSearchTenantList(params: any) {
        this.tenantTableFieldParams = params;
    }

    initTenantFieldArray(): void {
        this.tenantFieldArray = [{
            id: 1,
            fieldName: 'companyName',
            fieldLabel: '公司名称',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'status',
            fieldLabel: '租户状态',
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
        this.initTenantFieldArray();
    }

    ngOnDestroy() {

    }
}
