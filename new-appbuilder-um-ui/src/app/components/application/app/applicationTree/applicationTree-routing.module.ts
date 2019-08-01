import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { applicationTreeComponent } from './applicationTree.component';

const routes: Routes = [
    {
        path: '',
        component: applicationTreeComponent
    },{
        path: 'addActionPage',
        data: { title: '注册功能',operation:"add"},
        loadChildren: '../../action/page/add-action-page.module#AddActionPageModule'
    },{
        path: 'updateActionPage/:functionId',
        data: { title: '编辑功能',operation:"update"},
        loadChildren: '../../action/page/add-action-page.module#AddActionPageModule'
    },{
        path: 'updateChildActionPage/:functionId/:parentFucTypeDicId',
        data: { title: '编辑子功能',operation:"update"},
        loadChildren: '../../action/page/add-action-page.module#AddActionPageModule'
    },{
        path: 'viewActionPage/:functionId',
        data: { title: '查看功能',operation:"select"},
        loadChildren: '../../action/page/add-action-page.module#AddActionPageModule'
    },{
        path: 'addChildActionPage/:functionId/:parentFucTypeDicId',
        data: { title: '添加子功能',operation:"addChild"},
        loadChildren: '../../action/page/add-action-page.module#AddActionPageModule'
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

export class applicationTreeRoutingModule { }