import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsPermissionsTabsComponent } from './tenants-permissions-tabs.component';

const routes: Routes = [
    {
        path: '',
        component: TenantsPermissionsTabsComponent
    }, {
        path: 'user',
        loadChildren: './user-auth/user-auth.module#UserAuthModule'
    }, {
        path: 'func',
        loadChildren: './func-auth/func-auth.module#FuncAuthModule'
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

export class TenantsPermissionsTabsRoutingModule { }
