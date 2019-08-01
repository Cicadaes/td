import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissionsComponent } from './permissions.component';
const routes: Routes = [
    {
        path: '',
        component: permissionsComponent
    },
    {
        path: 'tenantDetails/:tenantId/:targetId/:name',
        data: { title: '数据对象权限设置',innerMenu:true},
        loadChildren: './tenant/tabs/tenant-permissions-tabs.module#TenantPermissionsTabsModule'
     },
    {
        path: 'dataObjDetail/:tenantId/:targetId/:name',
        data: { title: '数据对象详情',innerMenu:true},
        loadChildren: './tenant/data-object-detail/data-object-detail.module#DataObjectDetailModule'
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

export class permissionsRoutingModule { }