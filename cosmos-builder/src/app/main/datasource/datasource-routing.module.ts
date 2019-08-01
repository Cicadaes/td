import { DatasourceComponent } from './datasource.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasourceHomeComponent } from './datasource-home/datasource-home.component';
import { DatasourceCreateComponent } from './datasource-create/datasource-create.component';
import { DatasourceDetailComponent } from './datasource-detail/datasource-detail.component';

const routes: Routes = [{
    path: '',
    component: DatasourceComponent,
    children: [
        {
            path: '',
            component: DatasourceHomeComponent,
            data: {
                'title': [
                    { 'name': '数据源管理', 'url': 'datasource' }
                ]
            }
        },
        {
            path: 'create',
            component: DatasourceCreateComponent,
            data: {
                'title': [
                    { 'name': '数据源管理', 'url': 'datasource' },
                    { 'name': '新增数据源', 'url': '' }
                ],
            },
            // canDeactivate: [ DatasourceProvide ]
        },
        {
            path: 'modify/:id',
            component: DatasourceCreateComponent,
            data: {
                'title': [
                    { 'name': '数据源管理', 'url': 'datasource' },
                    { 'name': '数据源详情', 'url': '' },
                    { 'name': '修改数据源', 'url': '' }

                ]
            },
            // canDeactivate: [ DatasourceProvide ]
        },
        {
            path: 'detail/:id',
            component: DatasourceDetailComponent,
            data: {
                'title': [
                    { 'name': '数据源管理', 'url': 'datasource' },
                    { 'name': '数据源详情', 'url': '' }
                ]
            }
        },
    ]
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

export class DatasourceRoutingModule {

}
