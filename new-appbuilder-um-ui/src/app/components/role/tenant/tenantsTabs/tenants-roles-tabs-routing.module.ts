import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsRolesTabsComponent } from './tenants-roles-tabs.component';

const routes: Routes = [
    {
        path: '',
        component: TenantsRolesTabsComponent
    },
    {
        path: 'user',
        loadChildren: './user-auth/user-authTab.module#UserAuthModule'
    },
    {
        path: 'func',
        loadChildren: './func-auth/func-authTab.module#FuncAuthModule'
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

export class TenantsRolesTabsRoutingModule { }
