import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperPermissionsTabsComponent } from './super-permissions-tabs.component';
const routes: Routes = [
    {
        path: '',
        component: SuperPermissionsTabsComponent
    },{
        path: 'user',
        loadChildren: '../../user-auth/user-auth.module#UserAuthModule'
    },{
        path: 'func',
        loadChildren: '../../func-auth/func-auth.module#FuncAuthModule'
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

export class SuperPermissionsTabsRoutingModule { }