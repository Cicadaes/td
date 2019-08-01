import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperRolesTableComponent } from './super-roles-table.component';

const routes: Routes = [
    {
        path: '',
        component: SuperRolesTableComponent
    },
    {
        path: 'super/:userId/:roleId',
        data: { title: '角色详情', url: '/roles/super' },
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

export class SuperRolesTableRoutingModule { }