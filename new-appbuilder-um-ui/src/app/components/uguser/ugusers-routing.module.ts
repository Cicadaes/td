import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UgUsersComponent } from './ugusers.component';

const routes: Routes = [
    {
        path: '',
        component: UgUsersComponent
    },{
        path: 'addUgUserPage',
        data: { title: '添加用户',url:'/ugusers/addUgUserPage' },
        loadChildren: './page/add-uguser-page.module#AddUgUserPageModule'
    },{
        path: 'updateUgUserPage/:id',
        data: { title: '添加用户',url:'/ugusers/updateUgUserPage/:id' },
        loadChildren: './page/add-uguser-page.module#AddUgUserPageModule'
    },{
        path: 'ugusers',
        data: { title: '租户列表',url:'/ugusers' },
        loadChildren: './table/ugusers-table.module.ts#UgUsersTableModule'
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

export class UgUsersRoutingModule { }