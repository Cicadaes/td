import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RolesService } from './roles.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, OnDestroy {
    userId  = 0;
    tenantId  = 0;
    isSuper = false;
    isReloadUserTable = true;

    user: any;
    roleSearch: any = {};
    newRole: any;

    isShowAddRoleModal = false;
    roleFieldArray: any[];
    search: any;

    constructor(private service: RolesService, private router: Router, private activeRoute: ActivatedRoute) {
        setTimeout(() => {
            if (this.activeRoute.snapshot.params['tenantId'] != null) {
                this.tenantId = this.activeRoute.snapshot.params['tenantId'];
            } else if (window['appConfig'] && window['appConfig'].tenant) {
                this.tenantId = window['appConfig'].tenant.id;
            } else {
                this.tenantId = 0;
            }
            this.getRoleCode();
        }, 300);
    }

    ngOnInit() {
        this.initRoleFieldArray();
    }

    ngOnDestroy() {
    }

    getRoleCode(): void {
        this.service.getRoleCode().then((roleCode: any) => {
            this.isSuper = (roleCode === 'UM_SUPER_ADMIN');
        }).catch((err: any) => {
            console.log(err);
        });
    }

    initRoleFieldArray(): void {
        this.roleFieldArray = [{
            id: 1,
            fieldName: 'name',
            fieldLabel: '名称',
            fieldType: 'input'
        }, {
            id: 2,
            fieldName: 'createUserName',
            fieldLabel: '创建人',
            fieldType: 'input'
        }, {
            id: 3,
            fieldName: 'createTimeRange',
            fieldLabel: '创建时间',
            fieldType: 'date-range'
        }, {
            id: 4,
            fieldName: 'updateUserName',
            fieldLabel: '更新人',
            fieldType: 'input'
        }, {
            id: 5,
            fieldName: 'updateTimeRange',
            fieldLabel: '更新时间',
            fieldType: 'date-range'
        }];
    }

    showAddRoleModal() {
        this.isShowAddRoleModal = true;
        this.isReloadUserTable = false;
        // this.newRole = null;
    }

    hideAddRoleModal(newRole: any) {
        this.isShowAddRoleModal = false;
    }

    onSubmitUserFormData(params: boolean) {
        this.isReloadUserTable = params || false;
    }

    onSearchRoleList(roleSearch: any) {
        this.roleSearch = roleSearch;
        this.roleSearch.tenantId = this.tenantId;
    }

    onSearch(params: any, type: any) {
        const that = this;
        that.roleSearch.tenantId = that.tenantId;
        if (type === 'click') {
            if (params) {
                params = params.replace(/(^\s*)|(\s*$)/g, '');
            }
            that.roleSearch = { 'name': params };
        } else {
            if (params.keyCode === 13) {
                if (that.search) {
                    that.search = that.search.replace(/(^\s*)|(\s*$)/g, '');
                }
                that.roleSearch = { 'name': that.search };
            }
        }
    }
}
