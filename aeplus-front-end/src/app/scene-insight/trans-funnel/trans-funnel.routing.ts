import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FunnelTableComponent} from './funnel-table/funnel-table.component';
import {FunnelAddComponent} from './funnel-add/funnel-add.component';
import {FunnelSeeComponent} from './funnel-see/funnel-see.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }, {
        path: 'list', // 列表
        component: FunnelTableComponent
    }, {
        path: 'add', // 新建
        component: FunnelAddComponent
    }, {
        path: 'edit', // 编辑
        component: FunnelAddComponent
    }, {
        path: 'view', // 查看
        component: FunnelSeeComponent
    }

];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class TransFunnelRoutingModule {

}
