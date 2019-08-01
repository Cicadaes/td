import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsComponent } from './apps.component';


const routes: Routes = [
    {
        path: '',
        component: AppsComponent
    }, {
        path: 'addAppPage',
        data: { title: '注册应用' },
        loadChildren: './page/add-app-page.module#AddAppPageModule'
    }, { // 应用详情
        path: 'detailAppPage/:id',
        data: { title: '应用详情' },
        loadChildren: './detailPage/detail-app-page.module#DetailAppPageModule'
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

export class AppsRoutingModule { }
