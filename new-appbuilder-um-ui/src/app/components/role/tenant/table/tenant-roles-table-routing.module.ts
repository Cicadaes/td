import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantRolesTableComponent } from './tenant-roles-table.component';


const routes: Routes = [
    {
        path: '',
        component: TenantRolesTableComponent
    },{
        path: 'tenant/:userId/:tenantId/:roleId',
        data: { title: '角色详情',url:'/roles/tenant' },
        loadChildren: '../tabs/tenant-roles-tabs.module#TenantRolesTabsModule'
    },{
        path: 'tenant/:userId/:tenantId/:roleId',
        data: { title: '角色详情',url:'/roles/tenant' },
        loadChildren: '../tenantsTabs/tenants-roles-tabs.module#TenantsRolesTabsModule'
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

export class TenantRolesTableRoutingModule { }