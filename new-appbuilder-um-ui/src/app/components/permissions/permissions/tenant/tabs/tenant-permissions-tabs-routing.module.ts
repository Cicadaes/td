import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantPermissionsTabsComponent } from './tenant-permissions-tabs.component';

const routes: Routes = [
    {
        path: '',
        component: TenantPermissionsTabsComponent
    }, {
        path: 'default',
        // loadChildren: '../../user-auth/user-auth.module#UserAuthModule'
        loadChildren: '../../../permissionsDetail/user-auth/user-auth.module#UserAuthModule'
    },
    {
        path: 'manager',
        loadChildren: '../../../permissionsDetail/user-group-auth/user-group-auth.module#UserGroupAuthModule'
    },
    {
        path: 'role',
        loadChildren: '../../../permissionsDetail/dept-auth/dept-auth.module#DeptAuthModule'
    },
    {
        path: 'empower',
        loadChildren: '../../../permissionsDetail/func-auth/func-auth.module#FuncAuthModule'
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

export class TenantPermissionsTabsRoutingModule { }