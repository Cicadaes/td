import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserGroupPageComponent } from './add-userGroup-page.component';
import {UserGroupsTableModule} from "../table/userGroups-table.module";

const routes: Routes = [
    {
        path: '',
        component: AddUserGroupPageComponent
    },{
        path: 'userGroups',
        data: { title: '用户组列表',url:'/userGroups' },
        loadChildren: '../table/userGroups-table.module.ts#UserGroupsTableModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AddUserGroupPageRoutingModule { }