import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperRolesTabsComponent } from './super-roles-tabs.component';
const routes: Routes = [
    {
        path: '',
        component: SuperRolesTabsComponent
    }, {
        path: 'user',
        loadChildren: '../../user-auth/user-auth.module#UserAuthModule'
    }, {
        path: 'func',
        loadChildren: '../../func-auth-home/func-auth/func-auth.module#FuncAuthModule'
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

export class SuperRolesTabsRoutingModule { }