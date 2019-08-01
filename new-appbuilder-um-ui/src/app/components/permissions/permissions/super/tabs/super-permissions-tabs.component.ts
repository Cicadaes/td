import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {permissionsService} from "../../permissions.service";

@Component({
    selector: 'super-permissions-tabs',
    templateUrl: './super-permisions-tabs.component.html',
    styleUrls: ['./super-permissions-tabs.component.css']
})

export class SuperPermissionsTabsComponent implements OnInit  {
    userId: number = 0;
    roleId: number = 0;

    role: any = {};
    tabs = [
      {
        key: "user",
        value: "用户",
        url: "/roles/showUserAuth"
      },
      {
        key: "func",
        value: "功能",
        url: "/roles/showFuncAuth"
      }
    ];

    constructor(private service:permissionsService,private route : ActivatedRoute ) {
        this.userId =this.route.snapshot.params['userId'];
        this.roleId=this.route.snapshot.params['roleId'];
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
            this.service.getRoleById(this.roleId).then((data:any)=>{
                if (data.success == true) {
                    this.role = data.data;
                }
            }).catch((err:any)=>{
                console.log(err);
            });
        }
    }
}
