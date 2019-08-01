import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTenantLicenceComponent } from './edit-tenant-licence.component';

const routes: Routes = [
    {
        path: '',
        component: EditTenantLicenceComponent
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

export class EditTenantLicenceRoutingModule { }