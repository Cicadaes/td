import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TenantsLicencesTableComponent} from './tenants-licences-table.component';

const routes: Routes = [
    {
        path: '',
        component: TenantsLicencesTableComponent
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

export class TenantsLicencesTableRoutingModule { }