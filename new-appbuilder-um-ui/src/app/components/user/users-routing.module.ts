import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';

const routes: Routes = [
    {
        path: '',
        component: UsersComponent
    },
    {
        path: 'addUserPage',
        data: { title: '添加用户', url: '/users/addUserPage' },
        loadChildren: './page/add-user-page.module#AddUserPageModule'
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

export class UsersRoutingModule { }