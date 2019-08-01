import { Component, OnInit, OnDestroy } from '@angular/core';
import { TenantsAppsService } from './tenants-apps.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
    selector: 'tenants-apps',
    templateUrl: './tenants-apps.component.html',
    styleUrls: ['./tenants-apps.component.css']
})
export class TenantsAppsComponent implements OnInit, OnDestroy {
    appFieldArray: any[];
    isShowAddAppModal = false;
    appTableFieldParams: any;
    tenantId: any;
    rolecode: any;
    search: any;
    constructor(private service: TenantsAppsService, private route: ActivatedRoute) {
        this.tenantId = this.route.snapshot.params['tenantId'];
        if (this.rolecode === 'UM_TENANT_ADMIN') {
            this.tenantId = window['appConfig'].tenant.id;
        }
    }


    initAppFieldArray(): void {
        this.appFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '应用名称',
            fieldType: 'input'
        }];
    }
    ngOnInit() {
        this.rolecode = window['appConfig'].rolecode;
        this.initAppFieldArray();
    }

    showAddAppModal() {
        this.isShowAddAppModal = true;
    }
    hideAddAppModal(params: any) {
        this.isShowAddAppModal = false;
    }
    onSearchAppList(params: any) {
        this.appTableFieldParams = params;
    }
    onSearch(params: any, type: any) {
        const that = this;
        if (type === 'click') {
            if (params) {
                params = params.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.appTableFieldParams = { 'name': params };
        } else {
            if (params.keyCode === 13) {
                if (that.search) {
                    that.search = that.search.replace(/(^\s*)|(\s*$)/g, '');
                }
                that.appTableFieldParams = { 'name': that.search };
            }
        }
    }
    ngOnDestroy() {

    }

}
