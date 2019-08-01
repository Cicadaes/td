import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NoPermissionComponent } from './main/nopermission.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
    },
    {
      path: 'nopermission',
      component: NoPermissionComponent
    },
    {
        path: 'users',
        data: { title: '用户' },
        loadChildren: './components/user/users.module#UsersModule'
    },
    {
        path: 'roles',
        data: { title: '角色' },
        loadChildren: './components/role/roles.module#RolesModule'
    },
    {
      path: 'tenantsApps',
      data: { title: '应用' },
      loadChildren: './components/application/app/tenants/tenants-apps.module#TenantsAppsModule'
    },
    {
        path: 'licences',
        data: { title: '许可证' },
        loadChildren: './components/licence/licences.module#LicencesModule'
    },
    {
        path: 'organizations',
        data: { title: '组织机构' },
        loadChildren: './components/organization/organizations.module#OrganizationsModule'
    },
    {
      path: 'tenants',
      data: { title: '租户' },
      loadChildren: './components/tenant/tenants.module#TenantsModule'
    }
    // {
    //   path: 'settings',
    //   data: { title: '设置' },
    //   loadChildren: './components/setting/settings.module#SettingsModule'
    // },
    ,
    {
      path: 'userGroups',
      data: { title: '用户组' },
      loadChildren: './components/userGroup/userGroups.module#UserGroupsModule'
    },
    {
      path: 'tenantusers',
      data: { title: '用户', innerMenu: true },
      loadChildren: './components/tenantuser/tenantusers.module#TenantusersModule'
    },
    // {
    //   path: 'tenantusers2',
    //   data: { title: '用户', innerMenu: true },
    //   loadChildren: './components/tenantuser/tenantusers.module#TenantusersModule'
    // },
    // {
    //   path: 'actions',
    //   data: { title: '功能管理' },
    //   loadChildren: './components/application/action/actions.module#ActionsModule'
    // },
    {
        path: 'apps',
        data: { title: '应用' },
        loadChildren: './components/application/app/apps.module#AppsModule'
    },
    {
        path: 'logs',
        data: { title: '日志' },
        loadChildren: './components/log/logs.module#LogsModule'
    },
    {
      path: 'tenantsLicences',
      data: { title: '许可证' },
      loadChildren: './components/licence/tenants/tenants-licences.module#TenantsLicencesModule'
    },
    {
        path: 'dataPermissions',
        data: { title: '数据权限' },
        loadChildren: './components/permissions/permissions/permissions.module#permissionsModule'
    },
    {
      path: 'portalHomePage',
      data: { title: '系统配置 > 门户主页配置' },
      loadChildren: './components/configuration/configuration.module#ConfigurationModule'
    },
    {
        path: 'domainPrefixManagement',
        data: { title: '域名前缀管理' },
        loadChildren: './components/domainName/domain-name.module#DomainNameModule'
    },
    {
        path: 'apiManagement',
        data: { title: 'API元数据管理' },
        loadChildren: './components/api/api.module#ApiModule'
    },
    {
        path: 'responseCodeManagement',
        data: { title: '返回码管理' },
        loadChildren: './components/responseCode/response-code.module#ResponseCodeModule'
    },
    {
        path: 'gatewayRoute',
        data: { title: ' API网关路由规则'},
        loadChildren: './components/gatewayRoute/gateway-route.module#GatewayRouteModule'
    },
    {
        path: 'apiAccountManagement',
        data: { title: 'API账号管理'},
        loadChildren: './components/apiAccount/api-account.module#ApiAccountModule'
    },
    {
        path: 'tenantsApiAccount',
        data: { title: 'API账号管理'},
        loadChildren: './components/apiAccount/api-account.module#ApiAccountModule'
    },
    {
        path: 'systemSecurityConfig',
        data: { title: '系统配置 > 系统安全配置' },
        loadChildren: './components/configuration/system-security-config/system-security-config.module#SystemSecurityConfigModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { useHash: true }
        )
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingResetModule { }
