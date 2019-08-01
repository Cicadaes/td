import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { permissionsService } from "../../permissions.service";
import { TenantsPermissionsTabsService } from "./tenants-permissions-tabs.service";

@Component({
    selector: 'tenants-roles-tabs',
    templateUrl: './tenants-roles-tabs.component.html',
    styleUrls: ['./tenants-roles-tabs.component.css']
})

export class TenantsPermissionsTabsComponent implements OnInit {
    tenantId: number = 0;
    roleId: number = 0;
    appList: any[] = [];
    role: any = {};

    tabs = [{
        key: "user",
        value: "用户",
        url: "/roles/showFuncAuth"
    }, {
        key: "func",
        value: "授权",
        url: "/roles/showFuncAuth"
    }];

    constructor(private service: permissionsService, private tenantService: TenantsPermissionsTabsService, private route: ActivatedRoute) {
        this.tenantId = this.route.snapshot.params['tenantId'];
        this.roleId = this.route.snapshot.params['roleId'];
    }

    initFuncAuthList() {
        // let pa = { vroleId: this.roleId }
        // this.tenantService.queryAppListByRoleId(pa).then((data: any) => {
        //     if (data.success == 200) {
        //         this.appList = data.result;
        //     }
        // }).catch((err:any)=>{
        //     console.log(err);
        // });
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
