import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTenantLicenceComponent } from './add-tenant-licence.component';

const routes: Routes = [
    {
        path: '',
        component: AddTenantLicenceComponent
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

export class AddTenantLicenceRoutingModule { }