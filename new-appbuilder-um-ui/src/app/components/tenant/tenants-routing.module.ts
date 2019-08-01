import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsComponent } from './tenants.component';

const routes: Routes = [
    {
        path: '',
        component: TenantsComponent
    }
    , {
        path: 'updateTenantPage/:id',
        data: { title: '修改租户' },
        loadChildren: './page/add-tenant-page.module#AddTenantPageModule'
    }
    , {
        path: 'addTenantPage',
        data: { title: '添加租户' },
        loadChildren: './page/add-tenant-page.module#AddTenantPageModule'
    },
    {
        path: 'tenants',
        data: { title: '租户列表' },
        loadChildren: './table/tenants-table.module#TenantsTableModule'
    }
    , {
        path: 'tenantDetail/:tenantId',
        data: { title: '租户详情', innerMenu: true },
        loadChildren: './view/tenant-detail.module#TenantDetailModule'
    },
    {
        path: 'organizations/:tenantId',
        data: { title: '组织机构', innerMenu: true },
        loadChildren: '../organization/organizations.module#OrganizationsModule'
    },
     {
        path: 'tenantusers/:tenantId',
        data: { title: '用户列表', innerMenu: true },
        loadChildren: '../tenantuser/tenantusers.module#TenantusersModule'
    },
    {
        path: 'userGroups/:tenantId',
        data: { title: '用户组列表', innerMenu: true },
        loadChildren: '../userGroup/userGroups.module#UserGroupsModule'
    },
    {
        path: 'roles/:tenantId',
        data: { title: '角色列表', innerMenu: true },
        loadChildren: '../role/roles.module#RolesModule'
    },
    {
        path: 'dataPermissions/:tenantId',
        data: { title: '数据权限管理', innerMenu: true },
        loadChildren: '../permissions/permissions/permissions.module#permissionsModule'
    },

    // {
    //     path: 'tenantDetails/:tenantId/:targetId/:name', // 数据权限详情，租户下重新定义菜单时需要在这里定义
    //     data: { title: '数据对象详情', innerMenu: true },
    //     loadChildren: '../permissions/permissions/tenant/tabs/tenant-permissions-tabs.module#TenantPermissionsTabsModule'
    // },
    {
        path: 'tenantsApps/:tenantId',
        data: { title: '应用列表', innerMenu: true },
        loadChildren: '../application/app/tenants/tenants-apps.module#TenantsAppsModule'
    },
    // /*{
    //     path: 'licences/:tenantId',
    //     data: { title: '许可证列表',innerMenu:true},
    //     loadChildren: '../licence/licences.module.ts#LicencesModule'
    // },*/
    {
        path: 'tenantsLicences/:tenantId',
        data: { title: '许可证列表', innerMenu: true },
        loadChildren: '../licence/tenants/tenants-licences.module#TenantsLicencesModule'
    },
    {
        path: 'addTenantLicence',
        data: { title: '添加许可证', innerMenu: true},
        loadChildren: '../licence/tenants/add/add-tenant-licence.module#AddTenantLicenceModule'
    }, {
        path: 'editTenantLicence/:id',
        data: { title: '编辑许可证' },
        loadChildren: '../licence/tenants/edit/edit-tenant-licence.module#EditTenantLicenceModule'
    }, {
        path: 'detailTenantLicence/:id',
        data: { title: '许可证详情' },
        loadChildren: '../licence/tenants/detail/detail-tenant-licence.module#DetailTenantLicenceModule'
    },
    // {
    //     path: 'logs/:tenantId',
    //     data: { title: '日志列表', innerMenu: true },
    //     loadChildren: '../log/logs.module.ts#LogsModule'
    // },
    {
        path: 'tenantsApiAccount/:tenantId',
        data: { title: 'API账号管理', innerMenu: true },
        loadChildren: '../apiAccount/api-account.module#ApiAccountModule'
    },
    {
        path: 'tenantsApiAccount/:tenantId/detail/:id',
        data: { title: 'API账号详情', innerMenu: true },
        loadChildren: '../apiAccount/detail/api-account-detail.module#ApiAccountDetailModule'
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

export class TenantsRoutingModule { }

