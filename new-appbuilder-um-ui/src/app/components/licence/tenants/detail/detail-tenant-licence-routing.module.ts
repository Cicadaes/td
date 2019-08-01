import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailTenantLicenceComponent } from './detail-tenant-licence.component';

const routes: Routes = [
    {
        path: '',
        component: DetailTenantLicenceComponent
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

export class DetailTenantLicenceRoutingModule { }