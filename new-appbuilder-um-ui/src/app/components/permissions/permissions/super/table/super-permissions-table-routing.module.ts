import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperPermissionsTableComponent } from './super-permissions-table.component';

const routes: Routes = [
    {
        path: '',
        component: SuperPermissionsTableComponent
    },{
        path: 'super/:userId/:roleId',
        data: { title: '角色详情',url:'/roles/super' },
        loadChildren: '../tabs/super-roles-tabs.module#SuperRolesTabsModule'
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

export class SuperPermissionsTableRoutingModule { }