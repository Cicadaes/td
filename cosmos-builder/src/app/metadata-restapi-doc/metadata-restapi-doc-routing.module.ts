import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetadataRestapiDocComponent } from './metadata-restapi-doc.component';

const routes: Routes = [
    {
        path: '',
        component: MetadataRestapiDocComponent
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


export class MetadataRestapiDocRoutingModule { }