import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogsComponent } from './logs.component';

const routes: Routes = [
    {
        path: '',
        component: LogsComponent
    }, {
        path: 'detail/:logId',
        data: { title: '日志详情', url: '/logs/detail' },
        loadChildren: './detail/log-detail.module#LogDetailModule'
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class LogsRoutingModule { }
