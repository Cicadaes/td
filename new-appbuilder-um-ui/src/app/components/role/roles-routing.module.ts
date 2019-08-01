import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
const routes: Routes = [
    {
        path: '',
        component: RolesComponent
    },
    {
        path: 'super',
        data: { title: '角色详情', url: '/roles/super' },
        loadChildren: './super/tabs/super-roles-tabs.module#SuperRolesTabsModule'
    },
    {
        path: 'tenant',
        data: { title: '角色详情', url: '/roles/tenant' },
        loadChildren: './tenant/tabs/tenant-roles-tabs.module#TenantRolesTabsModule'
    }, {
        path: 'user',
        data: { title: '用户', url: '/roles/user' },
        loadChildren: './user-auth/user-auth.module#UserAuthModule'
    }, {
        path: 'usergroup',
        data: { title: '用户组', url: '/roles/usergroup' },
        loadChildren: './user-group-auth/user-group-auth.module#UserGroupAuthModule'
    }, {
        path: 'dept',
        data: { title: '组织机构', url: '/roles/dept' },
        loadChildren: './dept-auth/dept-auth.module#DeptAuthModule'
    }, {
        path: 'func',
        data: { title: '功能', url: '/roles/func' },
        loadChildren: './func-auth-home/func-auth-home.module#FuncAuthHomeModule'
    }, {
        path: 'tenantDetails/:userId/:roleId', // 普通用户角色详情
        data: { title: '角色详情', innerMenu: true },
        loadChildren: './tenant/tabs/tenant-roles-tabs.module#TenantRolesTabsModule'
    }, {
        path: 'tenantsDetails/:userId/:roleId', // 租户管理角色详情
        data: { title: '角色详情', innerMenu: true },
        loadChildren: './tenant/tenantsTabs/tenants-roles-tabs.module#TenantsRolesTabsModule'
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

export class RolesRoutingModule { }