import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import { RolesService } from '../../roles.service';
import { TenantRolesTabsService } from './tenant-roles-tabs.service';

@Component({
    selector: 'tenant-roles-tabs',
    templateUrl: './tenant-roles-tabs.component.html',
    styleUrls: ['./tenant-roles-tabs.component.css']
})

export class TenantRolesTabsComponent implements OnInit {
    tenantId: number = 0;
    roleId: number = 0;
    appList: any[] = [];
    role: any = {};

    tabs = [{
        key: 'user',
        value: '授予的用户',
        url: '/roles/showFuncAuth'
    }, {
        key: 'usergroup',
        value: '授予的用户组',
        url: '/roles/showUserGroupAuth'
    }, {
        key: 'dept',
        value: '授予的组织机构',
        url: '/roles/showDeptAuth'
    }, {
        key: 'func',
        value: '授权',
        url: '/roles/showFuncAuth'
    }];

    constructor(private service: RolesService, private tenantService: TenantRolesTabsService, private route: ActivatedRoute) {
        this.tenantId = this.route.snapshot.params['tenantId'];
        this.roleId = this.route.snapshot.params['roleId'];
    }

    initFuncAuthList() {
        let pa = { vroleId: this.roleId }
        this.tenantService.queryAppListByRoleId(pa).then((data: any) => {
            if (data.success == 200) {
                this.appList = data.result;
            }
        }).catch((err: any) => {
            console.log(err);
        });
    }

    ngOnInit() {
        this.initFuncAuthList();

        if (this.roleId != null) {
            this.service.getRoleById(this.roleId).then((data: any) => {
                if (data.success == true) {
                    this.role = data.data;
                }
            }).catch((err: any) => {
                console.log(err);
            });
        }
    }
}
