import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantRolesTabsComponent } from './tenant-roles-tabs.component';

const routes: Routes = [
    {
        path: '',
        component: TenantRolesTabsComponent
    }, {
        path: 'user',
        loadChildren: '../../user-auth/user-auth.module#UserAuthModule'
    }, {
        path: 'usergroup',
        loadChildren: '../../user-group-auth/user-group-auth.module#UserGroupAuthModule'
    }, {
        path: 'dept',
        loadChildren: '../../dept-auth/dept-auth.module#DeptAuthModule'
    }, {
        path: 'func',
        loadChildren: '../../func-auth-home/func-auth-home.module#FuncAuthHomeModule'
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

export class TenantRolesTabsRoutingModule { }