import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { permissionsService } from "../../permissions.service";
import { TenantPermissionsTabsService } from "./tenant-permissions-tabs.service";

@Component({
    selector: 'tenant-permissions-tabs',
    templateUrl: './tenant-permissions-tabs.component.html',
    styleUrls: ['./tenant-permissions-tabs.component.css']
})

export class TenantPermissionsTabsComponent implements OnInit {
    tenantId: number = 0;
    targetId: number = 0;
    name: string = '';
    appList: any[] = [];
    role: any = {};

    tabs = [
        {
            key: "default",
            value: "默认权限",
        },
        {
            key: "manager",
            value: "角色权限",
        },
        {
            key: "role",
            value: "角色层级权限",
        }, 
        {
            key: "empower",
            value: "实例授权",
        }
    ];

    constructor(private service: permissionsService, private tenantService: TenantPermissionsTabsService, private route: ActivatedRoute) {
        this.tenantId = this.route.snapshot.params['tenantId'];
        this.targetId = this.route.snapshot.params['targetId'];
        this.name = this.route.snapshot.params['name'];
    }

    initFuncAuthList() {
        // let pa = { vroleId: this.targetId }
    }

    ngOnInit() {
        this.initFuncAuthList();

        if (this.targetId != null) {
            this.service.getRoleById(this.targetId).then((data: any) => {
                if (data.success == true) {
                    this.role = data.data;
                }
            }).catch((err: any) => {
                console.log(err);
            });
        }
    }
}
