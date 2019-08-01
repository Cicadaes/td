import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TenantsTableService } from './tenants-table.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service';
import { NzModalService } from 'ng-cosmos-ui';


@Component({
    selector: 'app-tenants-table',
    templateUrl: './tenants-table.component.html',
    styleUrls: ['./tenants-table.component.css'],
})

export class TenantsTableComponent implements OnInit, OnChanges {
    @Input() queryParams: any;
    @Input() reload = false;
    isShowAddTenantModal = false;
    isReloadTenantTable = false;
    currentTenant: any;
    _current = 1;
    _pageSize = 10;
    _total = 1;
    _dataSet: any = [];
    _loading = true;
    _sortValue: any = null;

    constructor(
        private scrollSer: ScrollToTopService,
        private service: TenantsTableService,
        private router: Router,
        private nzModalService: NzModalService) {

    }

    sort(value: any) {
        this._sortValue = value;
        this.refreshData();
    }

    reset() {
        this.refreshData(true);
    }

    showAddTenantModal(tenant: any) {
        /*this.currentTenant = Tenant;
        this.isReloadTenantTable = false;
        this.isShowAddTenantModal = true;*/
        this.router.navigate(['/tenants/updateTenantPage', tenant.id]);
    }

    onSubmitTenantFormData(params: boolean) {
        this.isReloadTenantTable = params || false;
        if (this.isReloadTenantTable) {
            this.refreshData();
        }
    }

    showTenant(user: any) {
        this.currentTenant = user;
        this.isShowAddTenantModal = false;
        this.service.queryTenantById(user).then((data: any) => {
            let roleNames = '';
            if (data.success && data.data) {
                data.data.forEach((c: any, index: any) => {
                    roleNames += c.name;
                });
            }
            this.nzModalService.info({
                nzTitle: user.name + '被授权的角色',
                nzContent: roleNames
            });
        });

    }

    hideAddTenantModal(params: any) {
        this.isShowAddTenantModal = false;
    }

    refreshData(reset = false) {
        if (reset) {
            this._current = 1;
        }
        this._loading = true;
        const params = this.queryParams || {};
        params.page = this._current;
        params.rows = this._pageSize;
        this.service.getTenants(params).then((data: any) => {
            this._loading = false;
            this._total = data.total;
            this._dataSet = data.list;
            this.scrollSer.scrollToTop();
        });
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes.queryParams) {
            this.queryParams = changes.queryParams.currentValue || {};
        } else {
            this.queryParams = {};
        }
        if (changes.reload) {
            this.reload = changes.reload.currentValue || false;
        } else {
            this.reload = false;
        }

        if (this.reload) {
            this.refreshData();
        } else {
            this.reset();
        }
    }

    ngOnInit() {
    }
}
