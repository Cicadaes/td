import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap } from '@angular/router';
import { RolesService } from '../../roles.service';

@Component({
    selector: 'super-roles-tabs',
    templateUrl: './super-roles-tabs.component.html',
    styleUrls: ['./super-roles-tabs.component.css']
})

export class SuperRolesTabsComponent implements OnInit {
    userId =  0;
    roleId =  0;

    role: any = {};
    tabs = [
        {
            key: 'user',
            value: '用户',
            url: '/roles/showUserAuth'
        },
        {
            key: 'func',
            value: '功能',
            url: '/roles/showFuncAuth'
        }
    ];

    constructor(private service: RolesService, private route: ActivatedRoute) {
        this.userId = this.route.snapshot.params['userId'];
        this.roleId = this.route.snapshot.params['roleId'];
    }

    ngOnInit() {
        /*        if (this.user.id != null) {
                    this.service.getUserById(this.user.id).subscribe((data: any) => {
                        if (data.success == true) {
                            this.user = data.data;
                        }
                    });
                }*/
        if (this.roleId != null) {
            this.service.getRoleById(this.roleId).then((data: any) => {
                if (data.success === true) {
                    this.role = data.data;
                }
            }).catch((err: any) => {
                console.log(err);
            });
        }
    }
}
