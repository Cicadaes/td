import { MetadataDetailComponent } from './metadata-detail/metadata-detail.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetadataComponent } from './metadata.component';
import { MetadataManageComponent } from './metadata-manage/metadata-manage.component';
import { MetadataCreateComponent } from './metadata-create/metadata-create.component';

const routes: Routes = [{
    path: '',
    component: MetadataComponent,
    children: [
        {
            path: '',
            component: MetadataManageComponent,
            data: {
                'title': [{ 'name': '元数据管理', 'url': 'metadata' }]
            }
        },
        {
            path: 'create',
            component: MetadataCreateComponent,
            data: {
                'title': [
                    { 'name': '元数据管理', 'url': 'metadata' },
                    { 'name': '新增元数据对象', 'url': '' }
                ]
            },
            // canDeactivate: [ CanDeactivateProvide ]
        },
        {
            path: 'modify/:id',
            component: MetadataCreateComponent,
            data: {
                'title': [
                    { 'name': '元数据管理', 'url': 'metadata' },
                    { 'name': '元数据详情', 'url': '' },
                    { 'name': '修改元数据对象', 'url': '' }
                ]
            },
            // canDeactivate: [ CanDeactivateProvide ]
        },
        {
            path: 'detail/:id',
            component: MetadataDetailComponent,
            data: {
                'title': [
                    { 'name': '元数据管理', 'url': 'metadata' },
                    { 'name': '元数据详情', 'url': '' }
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

export class MetadataRoutingModule {

}
