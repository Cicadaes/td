import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUgUserPageComponent } from './add-uguser-page.component';

const routes: Routes = [
    {
        path: '',
        component: AddUgUserPageComponent
    },{
        path: 'ugusers',
        data: { title: '租户列表',url:'/ugusers' },
        loadChildren: '../table/ugusers-table.module.ts#UgUsersTableModule'
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

export class AddUgUserPageRoutingModule { }