import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
    },
    {
        path: 'main',
        loadChildren: './main/main.module#MainModule'
    },
    {
        path: 'publish/:id',
        loadChildren: './publish/publish.module#PublishModule'
    },
    {
        path: 'restapidoc',
        loadChildren: './metadata-restapi-doc/metadata-restapi-doc.module#MetadataRestapiDocModule'
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