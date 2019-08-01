import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailLicencePageComponent } from './detail-licence-page.component';

const routes: Routes = [
    {
        path: '',
        component: DetailLicencePageComponent
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

export class DetailLicencePageRoutingModule { }