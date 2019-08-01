import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiAccountComponent } from './api-account.component';
const routes: Routes = [
    {
        path: '',
        component: ApiAccountComponent
    },
    {
        path: 'detail/:id',
        data: { title: 'API账号详情' },
        loadChildren: './detail/api-account-detail.module#ApiAccountDetailModule'
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

export class ApiAccountRoutingModule { }
