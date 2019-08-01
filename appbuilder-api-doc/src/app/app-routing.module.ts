import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'api-doc',
        pathMatch: 'full'
    },
    {
        path: 'api-doc',
        data: { title: 'API接口分类查看' },
        loadChildren: './compontents/api-doc/api-doc.module#ApiDocModule'
    },
    {
        path: 'api-search',
        data: { title: 'API搜索详情' },
        loadChildren: './compontents/api-search/api-search.module#ApiSearchModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { useHash: true }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
