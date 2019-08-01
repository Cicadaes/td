import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { ReportconfigComponent } from './reportconfig/reportconfig.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: '',
                redirectTo: 'reportconfig',
                pathMatch: 'full'
            },
            {
                path: 'reportconfig',
                component: ReportconfigComponent,
                children: [
                    {
                        path: '',
                        loadChildren: './reportconfig/reporthome/reporthome.module#ReporthomeModule',
                        data: {
                            'title': [
                                { 'name': '报表配置', 'url': 'reportconfig' }
                            ]
                        }
                    },
                    {
                        path: 'reportDetail/:id',
                        loadChildren: './reportconfig/report/report-detail/report-detail.module#ReportDetailModule',
                        data: {
                            'title': [
                                { 'name': '报表配置', 'url': 'reportconfig' },
                                { 'name': '报表', 'url': 'reportconfig' },
                                { 'name': '', 'url': '' }
                            ]
                        }
                    },
                    {
                        path: 'refolderDetail/:id',
                        loadChildren: './reportconfig/reportfolder/reportfolder-detail/reportfolder-detail.module#ReportfolderdetailModule',
                        data: {
                            'title': [
                                { 'name': '报表配置', 'url': 'reportconfig' },
                                { 'name': '文件夹', 'url': 'reportconfig' },
                                { 'name': '文件夹详情', 'url': '' }
                            ]
                        }
                    }
                ]
            },
            {
                path: 'metadata',
                loadChildren: './metadata/metadata.module#MetadataModule'
            },
            {
                path: 'datasource',
                loadChildren: './datasource/datasource.module#DatasourceModule'
            }
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

export class MainRoutingModule {

}

